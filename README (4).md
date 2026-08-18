# 🏁 Corrida Maluca

Jogo de corrida em HTML5 Canvas + JavaScript puro, sem dependências externas. Desvie dos carros, colete estrelas e tente bater seu recorde.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![No dependencies](https://img.shields.io/badge/depend%C3%AAncias-zero-brightgreen)

## 🎮 Sobre o jogo

Você controla um carro em uma pista de 3 faixas. Carros adversários aparecem vindo em sua direção e você precisa desviar trocando de faixa. Estrelas amarelas aparecem pelo caminho e valem pontos extras. A velocidade aumenta conforme a pontuação sobe, deixando o jogo progressivamente mais difícil.

## ✨ Funcionalidades

- Movimento fluido entre 3 faixas
- Dificuldade progressiva (velocidade e frequência de obstáculos aumentam com a pontuação)
- Sistema de pontuação com recorde salvo durante a sessão
- Efeito de partículas ao coletar estrelas e ao colidir
- Suporte a controles por teclado, toque (swipe) e botões na tela
- Pausa/retomar a qualquer momento
- 100% responsivo, sem necessidade de instalação

## 🕹️ Como jogar

| Ação | Teclado | Toque |
|---|---|---|
| Mudar de faixa | `←` `→` ou `A` `D` | Arrastar (swipe) para os lados, ou botões ◀ ▶ |
| Pausar/continuar | `Espaço` | Botão ⏸ |

**Objetivo:** desvie dos carros o máximo de tempo possível e colete estrelas para aumentar sua pontuação.

## 🚀 Como executar

Não é necessário instalar nada — é um único arquivo HTML autocontido.

1. Baixe (ou clone) este repositório
2. Abra o arquivo `jogo-corrida.html` diretamente no navegador

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
# depois é só abrir jogo-corrida.html no navegador
```

Ou, para rodar com um servidor local (opcional, útil para evitar restrições de alguns navegadores):

```bash
python -m http.server 8000
# acesse http://localhost:8000/jogo-corrida.html
```

## 🗂️ Estrutura do projeto

```
.
├── jogo-corrida.html   # jogo completo (HTML + CSS + JS em um único arquivo)
└── README.md           # este arquivo
```

## 🛠️ Tecnologias

- **HTML5** — estrutura e elemento `<canvas>`
- **CSS3** — layout, gradientes e responsividade
- **JavaScript (Vanilla)** — lógica do jogo, física simples, colisões e renderização via Canvas API

Nenhuma biblioteca ou framework externo é utilizado.

## 🎨 Personalização

Algumas variáveis no topo do `<script>` podem ser ajustadas facilmente para alterar o comportamento do jogo:

- `baseSpeed` — velocidade inicial dos obstáculos
- `LANES` — número de faixas da pista
- `carColors` — paleta de cores dos carros adversários
- Intervalo de spawn de obstáculos e estrelas (dentro da função `update()`)

## 📌 Possíveis melhorias futuras

- [ ] Sistema de vidas em vez de game over instantâneo
- [ ] Power-ups (escudo, imã de estrelas, redução de velocidade)
- [ ] Efeitos sonoros e música de fundo
- [ ] Persistência do recorde entre sessões (ex: `localStorage` ao rodar fora de ambientes restritos)
- [ ] Modo noturno / temas visuais alternativos
- [ ] Ranking online

## 📄 Licença

Este projeto está disponível livremente para uso, modificação e distribuição. Sinta-se à vontade para adaptar como quiser.

---

Feito com 🏎️ e JavaScript puro.
