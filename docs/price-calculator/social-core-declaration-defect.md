# Blocker resolution: corrupt socialCore declaration

- Observed path: `src/lib/socialCore.d.ts`
- Observed size: 701 bytes
- Corruption: all 701 bytes were binary NUL (`0x00`) values on line 1. TypeScript emitted `TS1127: Invalid character` for columns 1 through 701.
- Mojibake classification: not mojibake. This was binary NUL content.
- Git history: none. The file was untracked and `git log --all -- src/lib/socialCore.d.ts` returned no commit.
- Imports and references: none in source or scripts.
- Applied resolution: deleted the dead corrupt declaration file. No compiler option, ignore directive, exclusion or skip setting was added.
- Runtime impact: none. The untracked `src/lib/socialCore.mjs` also has no source importer and was left untouched because it belongs to a separate workstream.
