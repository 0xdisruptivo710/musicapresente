import { Song, type SongProps } from '@/core/domain/entities/song';
import type { SongRepository } from '@/core/ports/repositories/song-repository';
import type {
  GenerateMusicParams,
  MusicGateway,
  MusicStatusResult,
} from '@/core/ports/gateways/music-gateway';

export class InMemorySongRepository implements SongRepository {
  readonly saved: SongProps[] = [];

  async saveMany(songs: Song[]): Promise<void> {
    for (const song of songs) this.saved.push(song.toPrimitives());
  }

  async findByOrderId(tenantId: string, orderId: string): Promise<Song[]> {
    return this.saved
      .filter((s) => s.tenantId === tenantId && s.orderId === orderId)
      .map((props) => Song.restore(props));
  }

  async unlockByOrderId(tenantId: string, orderId: string): Promise<void> {
    for (const song of this.saved) {
      if (song.tenantId === tenantId && song.orderId === orderId) song.locked = false;
    }
  }
}

/** Gateway de música falso (determinístico) — não chama a Suno. */
export class FakeMusicGateway implements MusicGateway {
  readonly generateCalls: GenerateMusicParams[] = [];
  taskId = 'task-fake-1';

  async generate(params: GenerateMusicParams): Promise<{ taskId: string }> {
    this.generateCalls.push(params);
    return { taskId: this.taskId };
  }

  async getStatus(): Promise<MusicStatusResult> {
    return { status: 'success', tracks: [] };
  }
}
