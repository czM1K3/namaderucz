# namaderu.cz

Toto je velice gurmánský repozitář stránky [namaderu.cz](https://namaderu.cz/).

## Build

```bash
docker build . -t ghcr.io/czm1k3/namaderucz
```

## Start

```bash
docker run --restart unless-stopped -d -v path-to-config:/app/config -p 3000:3000 ghcr.io/czm1k3/namaderucz
```
