---
title: PER(优势优先)
icon: solar:ranking-linear
createTime: 2026/07/04 10:00:00
permalink: /zh/guide/reweighter/per_advantage/
---

# PER — 基于 |advantage| 的优先加权

**来源:** *Prioritized Experience Replay*([arXiv:1511.05952](https://arxiv.org/abs/1511.05952)),
以 `|advantage|` 作为优先级(代理 TD-error)迁移到 LLM RL。

## 动机

高 |advantage| 的样本携带最强、最"意外"的学习信号。PER 式加权用一个可调幂次强调它们,
把梯度聚焦到最能推动策略的样本上。

## 规则

$$
w_i = |A_i|^{\alpha},\quad \text{再归一化到 } \bar{w}=1
$$

- `α = 0` → 均匀(退化为基线)。
- `α` 越大 → 越聚焦高 |advantage| 样本。
- 均值归一化保持等效学习率与基线可比。

## 在 DataFlex-RL 中

```yaml
trainer: {v1: {trainer_mode: dataflex_sync}}
dataflex:
  mechanism: reweight
  scorer:   {name: advantage_magnitude, params: {agg: mean}}
  actuator: {name: per_advantage, params: {alpha: 0.5}}
  warmup_step: 0
```

## 信号 / 规则 / 粒度

| 属性 | 值 |
|---|---|
| 信号 | 每样本 `|advantage|` |
| 规则 | `w = |A|^α`,均值归一化 |
| 粒度 | prompt(每样本) |
| 需要分组 | 否(任意 advantage 估计器) |
| 额外前向 | 无 |

::: tip 与 Advantage Reweighting 的区别
`per_advantage` 上调**高 |advantage| 样本**(优先化)。而
[`advantage_reweight`](../advantage_reweight/) 是抑制**低概率 token** —— 不同信号
(per-token `π_θ`)、不同目标(稳定性)。
:::
