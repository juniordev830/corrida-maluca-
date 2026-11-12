# Corrida Maluca

Jogo de corrida para navegador desenvolvido com HTML5 Canvas, CSS e JavaScript puro, com adaptação Android em desenvolvimento.

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

- Testar a experiência em aparelhos e emuladores Android.
- Melhorar a acessibilidade e o feedback para diferentes dispositivos.
- Preparar ícone, identidade visual e versão de lançamento.

Projeto experimental em desenvolvimento.


## Android — primeira etapa

A versão Android está em desenvolvimento na branch `feature/android-corrida-colorida`.
O jogo continua executável no navegador; a nova fase inclui cones, barreiras
e buracos, além de um layout mais confortável em celulares.

Antes de cada corrida, escolha Tranquilo, Normal ou Desafio. Cada nível guarda
seu próprio recorde no dispositivo. O recorde anterior permanece no modo Normal.

O projeto usa Capacitor 8 para reaproveitar HTML, CSS e JavaScript como app Android.
Consulte [o passo a passo do Android Studio](docs/ANDROID.md).
O GitHub Actions gera um APK de depuração para testes; ele ainda não foi
validado em aparelhos reais. Não há AAB de lançamento nem publicação na Play Store.

## Validação e manutenção

Para revisar alterações neste projeto, consulte o [guia técnico de validação](docs/GUIA_DE_VALIDACAO.md), com comandos, cenários de regressão e próximos incrementos.
