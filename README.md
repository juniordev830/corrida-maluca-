# Corrida Maluca

Jogo de corrida para navegador desenvolvido com HTML5 Canvas, CSS e JavaScript puro. O jogo está concentrado no arquivo `jogo-corrida.html`.

## Como jogar

- Desvie dos carros adversários mudando de faixa.
- Colete estrelas para aumentar a pontuação.
- Tente sobreviver enquanto a velocidade e a dificuldade aumentam.
- Use as setas ou A/D para mudar de faixa e Espaço para pausar; em telas sensíveis ao toque, use os controles na tela.

## Executar localmente

Não é necessário instalar dependências.

1. Clone ou baixe este repositório.
2. Abra `jogo-corrida.html` em um navegador moderno.

Opcionalmente, inicie um servidor local na raiz:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000/jogo-corrida.html`.

> **Acesso pela internet:** abrir o arquivo ou iniciar um servidor local não publica o jogo na internet. Para disponibilizá-lo publicamente, configure uma hospedagem de site estático, por exemplo GitHub Pages.

## Tecnologias

- HTML5 e Canvas API
- CSS3
- JavaScript sem framework externo

Para detalhes adicionais de controles, pontuação e personalização, consulte o [Guia do Jogo](docs/GUIA_DO_JOGO.md).

## Estrutura

- `jogo-corrida.html`: estrutura da interface e elementos do jogo.
- `styles.css`: estilos responsivos da interface.
- `game.js`: lógica, renderização, controles e estado da partida.
- `docs/GUIA_DO_JOGO.md`: guia complementar.
- `README.md`: documentação principal.

## Próximas melhorias

- Adicionar testes automatizados de jogabilidade.
- Melhorar acessibilidade e feedback para diferentes dispositivos.
- Separar a lógica JavaScript do HTML para facilitar manutenção.

Projeto experimental em desenvolvimento.
