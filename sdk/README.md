# Nomyx Resonance SDK (TypeScript)

Minimal fetch-based client for the Nomyx Resonance Platform API.

## Install
```bash
npm i nomyx-resonance-sdk
# or use the local folder with `npm i ./nomyx-resonance-sdk`
```

## Usage
```ts
import { NomyxClient } from "nomyx-resonance-sdk";

const client = new NomyxClient({ apiKey: process.env.NOMYX_API_KEY!, baseUrl: "https://sandbox.nomyx.dev" });

const sat = await client.srsSolve({
  problem: "3sat",
  spec: {
    variables: 4,
    clauses: [
      [{var:1,neg:false},{var:2,neg:true},{var:3,neg:false}],
      [{var:2,neg:false},{var:3,neg:false},{var:4,neg:true}]
    ]
  },
  config: { stop: { iterMax: 5000 } }
});

console.log(sat);
```
