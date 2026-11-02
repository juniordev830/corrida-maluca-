# Corrida Maluca no Android Studio

Esta é a **primeira etapa de adaptação**, não um aplicativo já publicado.
O jogo web roda offline, sem contas, anúncios ou acesso à internet.
O Capacitor usa o jogo existente (HTML, CSS e JavaScript) em uma WebView Android.

## Requisitos

- Node.js 22 ou superior (Capacitor 8).
- Android Studio compatível com Capacitor 8 (2025.2.1 ou posterior).
- Android SDK configurado pelo Android Studio.

## Primeira execução

Na pasta do repositório, execute:

```bash
npm install
npm run check
npm run build:web
npm run android:add
npm run android:open
```

O comando `android:add` deve ser executado **uma vez**: ele gera a pasta
`android/`, que será aberta no Android Studio. Se a pasta já existir, **não**
rode `android:add` novamente.

No Android Studio, aguarde a sincronização do Gradle, selecione um emulador
Android configurado e clique em **Run** para instalar e testar o jogo.

## Após alterar HTML, CSS ou JavaScript

```bash
npm run android:sync
npm run android:open
```

O comando de sincronização gera novamente `www/` e atualiza os recursos
do projeto Android. Execute Run novamente no Android Studio.

## Como o jogo funciona

- Controles por toque: botões esquerda/direita e gesto lateral.
- Obstáculos: carros, cones, barreiras e buracos.
- Estrelas concedem pontos; o recorde é mantido no armazenamento local.
- Pausa e reinício continuam funcionando.
- Ao trocar de aplicativo ou ocultar a página, a corrida pausa automaticamente;
  toque em **Continuar** para retomá-la.

## Preparação para Play Store

Antes de publicar: testar em celulares de vários tamanhos, gerar ícone e
splash screen próprios, revisar acessibilidade e política de privacidade,
validar compatibilidade de SDK, configurar assinatura segura e produzir
o AAB de lançamento no Android Studio. A publicação exige uma conta
Play Console e análise do Google, sem garantia de aprovação.

**Não publique chaves de assinatura, senhas ou arquivos .jks/.keystore.**
