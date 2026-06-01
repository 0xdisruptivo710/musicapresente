import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixa a raiz do workspace neste diretório. Há um package-lock.json solto na
  // home do usuário que, sem isto, faz o Turbopack inferir a raiz errada.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
