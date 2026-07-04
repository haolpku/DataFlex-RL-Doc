---
title: PODS(最大方差)
icon: solar:chart-square-outline
createTime: 2026/07/04 10:00:00
permalink: /zh/guide/selector/pods_maxvar/
---

# PODS — 最大方差下采样

**来源:** *Not All Rollouts are Useful: Down-Sampling Rollouts in LLM RL*
([arXiv:2504.13818](https://arxiv.org/abs/2504.13818))。

## 动机

生成一个大组,但只用最有学习信号的子集更新。PODS 保留每组中**使 reward 方差最大**的
size-`n` 子集(对策略更新最有信息量的分布),其余省下算力。

## 规则(按 uid 组)

选 `S ⊂ 组`,`|S| = n`,最大化 `Var({R_i : i ∈ S})`。

**极值锚定定理:** 使方差最大的子集必然是 `a` 个最低 reward + `(n−a)` 个最高 reward
(绝不含中间值)。所以按 reward 排序,用前缀和扫描 `a = 0..n` —— `O(G log G)`:

```
for a in 0..n:  S_a = {a 个最低} ∪ {(n-a) 个最高};  var = Var(S_a)   # 前缀和 O(1)
取 a* = argmax var
```

**二值 reward**(0/1):方差 `p(1−p)` 在 `p=1/2` 最大,所以保留等量的对/错回答。

## 在 DataFlex-RL 中

```yaml
trainer: {v1: {trainer_mode: dataflex_sync}}
dataflex:
  mechanism: select
  scorer:   {name: reward_difficulty}
  actuator: {name: max_variance, params: {keep_fraction: 0.5}}
  warmup_step: 0
```

`keep_fraction` 设 `n = round(f · G)`。`n=5` 条 rollout、`f=0.5` 时,每组保留 ~2–3 条
(高/低 reward 均衡)。

## 信号 / 规则 / 粒度

| 属性 | 值 |
|---|---|
| 信号 | 每条回答的 reward |
| 规则 | 组内最大方差子集(极值锚定) |
| 粒度 | response(uid 组内) |
| 需要分组 | 是 |
| 额外前向 | 无 |
