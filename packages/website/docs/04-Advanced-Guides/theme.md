---
title: Theme
---

### テーマについて

4つのテーマが用意されているよ。例えば「Lime」。OAS上で指定してね。development環境やproduction環境で違うテーマを指定するのがおすすめだよ。

```json
{
  openapi: '3.0.2',
  info: {
    'x-theme': 'lime'
  },
}
```

### モードについて
1テーマ毎にLightモードとDarkモードの2つのがあるよ。Light/Darkの切り替えはユーザのpreference設定に応じて適用されるよ。

### カラーシステムについて

[Google Material Designのカラーシステム](https://material.io/design/color/the-color-system.html)をベースにしてるよ。

色の種類と算出方法は以下のルールね。

#### Darkモード
| 名称 | 役割 | 算出方法 |
| ---- | ---- | ---- |
| background | viewport最背面の背景色 | #121212で固定 |
| surface | 表面 | backgroundの上に8%透過Primaryを重ねる |
| surface-00dp | 表面 elevetionが0 | surfaceと同じ |
| surface-01dp | 表面 elevetionが1 | surfaceに5%透過の#FFFFFFを重ねる |
| surface-02dp | 表面 elevetionが2 | surfaceに7%透過の#FFFFFFを重ねる |
| surface-03dp | 表面 elevetionが3 | surfaceに8%透過の#FFFFFFを重ねる |
| surface-04dp | 表面 elevetionが4 | surfaceに9%透過の#FFFFFFを重ねる |
| surface-06dp | 表面 elevetionが6 | surfaceに11%透過の#FFFFFFを重ねる |
| surface-08dp | 表面 elevetionが8 | surfaceに12%透過の#FFFFFFを重ねる |
| surface-12dp | 表面 elevetionが12 | surfaceに14%透過の#FFFFFFを重ねる |
| surface-16dp | 表面 elevetionが16 | surfaceに15%透過の#FFFFFFを重ねる |
| surface-24dp | 表面 elevetionが24 | surfaceに16%透過の#FFFFFFを重ねる |
| primary | プライマリ | カラーパレットのA400 |
| primary-variant | プライマリ | カラーパレットのA700 |
| secondary | セカンダリ | カラーパレットのA100 |
| secondary-variant | セカンダリ | カラーパレットのA200 |
| error | エラー | #B00020に40%透過の#FFFFFFを重ねる |
| on-background | 文字やアイコン色       | on-background-mediumと同じ |
| on-background-high | 文字やアイコン色     | backgroundに87%透過#FFFFFFを重ねる |
| on-background-medium | 文字やアイコン色   | backgroundに60%透過#FFFFFFを重ねる |
| on-background-disabled | 文字やアイコン色 | backgroundに38%透過#FFFFFFを重ねる |
| on-background-variant | 文字やアイコン色       | on-background-variant-mediumと同じ |
| on-background-variant-high | 文字やアイコン色     | backgroundに87%透過Primaryを重ねる |
| on-background-variant-medium | 文字やアイコン色   | backgroundに60%透過Primaryを重ねる |
| on-background-variant-disabled | 文字やアイコン色 | backgroundに38%透過Primaryを重ねる |
| on-surface | 文字やアイコン色       | on-surface-mediumと同じ |
| on-surface-high | 文字やアイコン色     | surfaceに87%透過#FFFFFFを重ねる |
| on-surface-medium | 文字やアイコン色   | surfaceに60%透過#FFFFFFを重ねる |
| on-surface-disabled | 文字やアイコン色 | surfaceに38%透過#FFFFFFを重ねる |
| on-primary | 文字やアイコン色       | on-primary-mediumと同じ |
| on-primary-high | 文字やアイコン色     | primaryに87%透過backgroundを重ねる |
| on-primary-medium | 文字やアイコン色   | primaryに60%透過backgroundを重ねる |
| on-primary-disabled | 文字やアイコン色 | primaryに38%透過backgroundを重ねる |
| on-primary-variant | 文字やアイコン色       | on-primary-variant-mediumと同じ |
| on-primary-variant-high | 文字やアイコン色     | primary-variantに87%透過backgroundを重ねる |
| on-primary-variant-medium | 文字やアイコン色   | primary-variantに60%透過backgroundを重ねる |
| on-primary-variant-disabled | 文字やアイコン色 | primary-variantに38%透過backgroundを重ねる |
| on-secondary | 文字やアイコン色       | on-secondary-mediumと同じ |
| on-secondary-high | 文字やアイコン色     | secondaryに87%透過backgroundを重ねる |
| on-secondary-medium | 文字やアイコン色   | secondaryに60%透過backgroundを重ねる |
| on-secondary-disabled | 文字やアイコン色 | secondaryに38%透過backgroundを重ねる |
| on-secondary-variant | 文字やアイコン色       | on-secondary-variant-mediumと同じ |
| on-secondary-variant-high | 文字やアイコン色     | secondary-variantに87%透過backgroundを重ねる |
| on-secondary-variant-medium | 文字やアイコン色   | secondary-variantに60%透過backgroundを重ねる |
| on-secondary-variant-disabled | 文字やアイコン色 | secondary-variantに38%透過backgroundを重ねる |
| on-error | 文字やアイコン色       | on-error-mediumと同じ |
| on-error-high | 文字やアイコン色     | errorに87%透過#B00020を重ねる |
| on-error-medium | 文字やアイコン色   | errorに60%透過#B00020を重ねる |
| on-error-disabled | 文字やアイコン色 | errorに38%透過#B00020を重ねる |

#### Lightモード
| 名称 | 役割 | 算出方法 |
| ---- | ---- | ---- |
| background | viewport最背面の背景色 | #F8F8F8で固定 |
| surface | 表面 | backgroundの上に8%透過Primaryを重ねる |
| surface-00dp | 表面 elevetionが0  | surfaceと同じ |
| surface-01dp | 表面 elevetionが1  | surfaceに 5%透過のPrimaryを重ねる |
| surface-02dp | 表面 elevetionが2  | surfaceに 7%透過のPrimaryを重ねる |
| surface-03dp | 表面 elevetionが3  | surfaceに 8%透過のPrimaryを重ねる |
| surface-04dp | 表面 elevetionが4  | surfaceに 9%透過のPrimaryを重ねる |
| surface-06dp | 表面 elevetionが6  | surfaceに11%透過のPrimaryを重ねる |
| surface-08dp | 表面 elevetionが8  | surfaceに12%透過のPrimaryを重ねる |
| surface-12dp | 表面 elevetionが12 | surfaceに14%透過のPrimaryを重ねる |
| surface-16dp | 表面 elevetionが16 | surfaceに15%透過のPrimaryを重ねる |
| surface-24dp | 表面 elevetionが24 | surfaceに16%透過のPrimaryを重ねる |
| primary | プライマリ | カラーパレットのA900 |
| primary-variant | プライマリ | カラーパレットのA800 |
| secondary | セカンダリ | カラーパレットのA700 |
| secondary-variant | セカンダリ | カラーパレットのA600 |
| error | エラー | #B00020で固定 |
| on-background | 文字やアイコン色       | on-background-mediumと同じ |
| on-background-high | 文字やアイコン色     | backgroundに87%透過#000000を重ねる |
| on-background-medium | 文字やアイコン色   | backgroundに60%透過#000000を重ねる |
| on-background-disabled | 文字やアイコン色 | backgroundに38%透過#000000を重ねる |
| on-background-variant | 文字やアイコン色       | on-background-variant-mediumと同じ |
| on-background-variant-high | 文字やアイコン色     | backgroundに87%透過Primaryを重ねる |
| on-background-variant-medium | 文字やアイコン色   | backgroundに60%透過Primaryを重ねる |
| on-background-variant-disabled | 文字やアイコン色 | backgroundに38%透過Primaryを重ねる |
| on-surface | 文字やアイコン色       | on-surface-mediumと同じ |
| on-surface-high | 文字やアイコン色     | surfaceに87%透過#000000を重ねる |
| on-surface-medium | 文字やアイコン色   | surfaceに60%透過#000000を重ねる |
| on-surface-disabled | 文字やアイコン色 | surfaceに38%透過#000000を重ねる |
| on-primary | 文字やアイコン色       | on-primary-mediumと同じ |
| on-primary-high | 文字やアイコン色     | primaryに87%透過backgroundを重ねる |
| on-primary-medium | 文字やアイコン色   | primaryに60%透過backgroundを重ねる |
| on-primary-disabled | 文字やアイコン色 | primaryに38%透過backgroundを重ねる |
| on-primary-variant | 文字やアイコン色       | on-primary-variant-mediumと同じ |
| on-primary-variant-high | 文字やアイコン色     | primary-variantに87%透過backgroundを重ねる |
| on-primary-variant-medium | 文字やアイコン色   | primary-variantに60%透過backgroundを重ねる |
| on-primary-variant-disabled | 文字やアイコン色 | primary-variantに38%透過backgroundを重ねる |
| on-secondary | 文字やアイコン色       | on-secondary-mediumと同じ |
| on-secondary-high | 文字やアイコン色     | secondaryに87%透過backgroundを重ねる |
| on-secondary-medium | 文字やアイコン色   | secondaryに60%透過backgroundを重ねる |
| on-secondary-disabled | 文字やアイコン色 | secondaryに38%透過backgroundを重ねる |
| on-secondary-variant | 文字やアイコン色       | on-secondary-variant-mediumと同じ |
| on-secondary-variant-high | 文字やアイコン色     | secondary-variantに87%透過backgroundを重ねる |
| on-secondary-variant-medium | 文字やアイコン色   | secondary-variantに60%透過backgroundを重ねる |
| on-secondary-variant-disabled | 文字やアイコン色 | secondary-variantに38%透過backgroundを重ねる |
| on-error | 文字やアイコン色       | on-error-mediumと同じ |
| on-error-high | 文字やアイコン色     | errorに87%透過backgroundを重ねる |
| on-error-medium | 文字やアイコン色   | errorに60%透過backgroundを重ねる |
| on-error-disabled | 文字やアイコン色 | errorに38%透過backgroundを重ねる |
