---
title: TSCL(学习进度)
icon: solar:graph-up-linear
createTime: 2026/07/04 10:00:00
permalink: /zh/guide/mixer/tscl/
---

# TSCL — 师生课程学习(学习进度)

**来源:** *Teacher-Student Curriculum Learning*
([arXiv:1707.00183](https://arxiv.org/abs/1707.00183)),作为域 Mixer。

## 动机

按**学习进度**——即每个域 reward 曲线的*斜率*——而非 reward *水平*来配比采样。这是一个
不同于 [`reward_gap`](../quickstart/)(reward 水平)和 [`dump_ucb`](../dump_ucb/)
(|advantage|)的信号轴:TSCL 关注**变化率**。reward 上升(还在学)和下降(遗忘)都有
信息,所以用斜率的**绝对值**驱动采样。

## 规则

对每个域 `d`,维护 reward 均值的滑动窗口,用最小二乘拟合斜率 `slope_d = dR/dstep`,然后:

$$
p_d = \mathrm{softmax}\!\left(\frac{|slope_d|}{T}\right),\quad \text{带 floor}
$$

- `|slope|`(默认):采样正在**变化**的域(进步或遗忘)。
- `signed=True`:用 `max(slope, 0)`,只采样**在进步**的域。

## 在 DataFlex-RL 中

```yaml
trainer:
  v1:
    trainer_mode: dataflex_mix_sync
    sampler:
      custom_sampler: {path: pkg://dataflex_verl.replay_buffer, name: DataFlexMixReplayBuffer}
dataflex:
  mechanism: mix
  domains: [math, code, logic]
  scorer:   {name: reward_difficulty}
  actuator: {name: tscl, params: {temperature: 1.0, floor: 0.05, signed: false}}
  warmup_step: 5
  update_step: 5
  window: 50
```

mix trainer 用 `DomainStatsTracker.slope()`(窗口最小二乘)算每个域的 reward 斜率,传给 mixer。

## 信号 / 规则 / 粒度

| 属性 | 值 |
|---|---|
| 信号 | 每域 reward **斜率**(学习进度) |
| 规则 | `softmax(|slope|/T)` 带 floor |
| 粒度 | domain |
| 需要分组 | 否 |
| 额外前向 | 无 |

::: tip 需要 ≥3 个异质域
和所有 mixer 一样,2 个域时 TSCL 作用很小(退化成一个比例旋钮)。它在 ≥3 个难度不同、
且在动态变化的域上才有价值。需要 warmup 累积足够的窗口点才能得到稳定斜率。
:::
