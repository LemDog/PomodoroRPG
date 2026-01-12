import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['electron/main.ts', 'electron/preload.ts'],
    outDir: 'dist-electron',
    external: ['electron'],
    format: ['cjs'],
    clean: true,
    bundle: true,
    sourcemap: true,
    minify: false,
    dts: false,
});
