---
title: 算法与信号总览
icon: solar:list-check-bold
createTime: 2026/07/06 10:00:00
permalink: /zh/guide/basicinfo/algorithms/
---

# 算法与信号总览

DataFlex-RL 里每个数据调度方法都可拆成:**一个信号**(按 token / 样本 / 组 / 域计算的
标量或张量)喂给**一条规则**(select / reweight / mix)。本页是唯一一处能跨三机制一览
**每个算法用什么信号、信号从哪来**的地方。

> 研究前沿主要在于*新信号* —— 规则(top-k、softmax、band、UCB、阈值、最大方差)是共享、
> 可互换的。

## 总表

| 算法 | 机制 | 信号 | 粒度 | 出处(arXiv) |
|---|---|---|---|---|
| `threshold_band` | select | 组正确率 / 任意分数落在带内 | prompt/组 | DAPO 2503.14476 |
| [`difficulty_filtering`](../../selector/difficulty_filtering/) | select | 组 **pass-rate**,保留 0.2–0.8 带 | prompt/组 | 2504.03380 |
| [`gfpo`](../../selector/gfpo/) | select | 回答**长度 + reward**(简洁度/token效率),组内 top-k | response(组) | 2508.09726 |
| [`pods_maxvar`](../../selector/pods_maxvar/)(`max_variance`) | select | 每条回答 **reward**,最大方差子集 | response(组) | 2504.13818 |
| `topk_fraction` | select | 每样本 **\|advantage\|**,保留 top 比例 | prompt | 通用(PER 思路) |
| [`advantage_reweight`](../../reweighter/advantage_reweight/) | reweight | per-token **π_θ**(概率),抑制低概率 token | token | 2505.12929 |
| [`per_advantage`](../../reweighter/per_advantage/) | reweight | 每样本 **\|advantage\|**(`w=\|A\|^α`) | prompt | PER 1511.05952 |
| `softmax` | reweight | 任意 per-sample 分数(`softmax(s/T)`) | prompt | 通用基线 |
| `difficulty_band` | reweight | per-seq **reward** 分位带 | prompt | 通用(参考 ODSW) |
| [`dump_ucb`](../../mixer/dump_ucb/) | mix | per-domain **\|advantage\|** + UCB | domain | 2504.09710 |
| [`tscl`](../../mixer/tscl/) | mix | per-domain **reward 斜率**(学习进度) | domain | 1707.00183 |
| `reward_gap` | mix | per-domain **平均 reward**(偏向落后域) | domain | 通用(参考 DoReMi) |
| `static` | mix | 固定配比 | domain | 基线 |

## 按信号轴归类

- **reward 水平 / pass-rate** — `difficulty_filtering`、`pods_maxvar`、`difficulty_band`、
  `reward_gap`、`tscl`(用斜率)、`threshold_band`。
- **|advantage|** — `topk_fraction`、`per_advantage`、`softmax`(此处用法)、`dump_ucb`。
- **token 概率** — `advantage_reweight`。
- **长度 / token 效率** — `gfpo`。

## 关于出处(诚实说明)

大多数算法是把**已发表方法的核心思想**映射到 DataFlex 的 Scorer→Actuator 抽象;少数
(`topk_fraction`、`softmax`、`difficulty_band`、`reward_gap`、`static`)是抽象本身提供的
**通用机制旋钮**,并非对某一篇论文的忠实复现。标了论文的,实现捕捉的是它的*信号 + 规则*,
不一定包含原文的所有训练 trick。证据等级与完整出处见 survey(`Awesome-RL-OPD-Data`)。
