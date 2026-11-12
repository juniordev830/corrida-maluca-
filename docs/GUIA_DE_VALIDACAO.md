# Roteiro de validação do jogo

O jogo principal é `jogo-corrida.html`, com lógica em `game.js` e estilos em `styles.css`. O suporte Android é uma frente em desenvolvimento, detalhada em `docs/ANDROID.md`, e não deve ser anunciado como pacote lançado.

## Executar

```bash
python -m http.server 8000
```

Abrir `http://localhost:8000/jogo-corrida.html`. Também é possível abrir o HTML diretamente, mas um servidor local facilita a depuração.

## Testes manuais

1. Confirmar movimento por setas e A/D e pausa por Espaço.
2. Testar colisão com carros, coleta de estrelas, pontuação e aumento de velocidade.
3. Repetir em viewport de celular: botões de toque devem responder sem rolagem indevida.
4. Alternar de aba e retornar: conferir pausa, tempo e estado da partida.
5. Reiniciar após perder e verificar se pontuação e velocidade voltam ao estado inicial.
6. Inspecionar o console do navegador em busca de erros durante uma partida prolongada.

Executar os testes de `tests/frame-rate.test.js` pelo comando definido em `package.json`.

## Próxima melhoria técnica

Padronizar atualização com delta de tempo, medir a progressão de dificuldade em telas de 60/120 Hz e acrescentar testes de colisão e reinicialização. Antes do Android, validar controle por toque e diferentes proporções de tela.
