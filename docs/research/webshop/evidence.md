# WebShop evidence

Verified on 2026-09-27. This page tracks original paper baselines.
It does not claim current model coverage.

## Scores

[Paper version 4](https://arxiv.org/pdf/2207.01206v4#page=7) reports these exact success rates in
Figure 4 and Section 5.2:

- IL: 29.1%.
- IL+RL: 28.7%.
- Rule: 9.6%.

Figure 4 reports three trials. Section 5.1 identifies the 500-task
test split. Section 3.1 states that models use simple mode.
Success rate counts reward 1. Task score includes partial credit
and is a separate metric. The source version is dated 2023-02-08.

## Exact tasks

The page copies the first instruction for product keys `B09QKP7XQL`,
`B08Y865MTQ`, and `B01LOUY5M8` from the public
`baseline_models/data/items_human_ins.json` file at commit
`64fa2a5c15c7daa698b9ac93f5bb5437b634c9bd`. Only instruction text is copied.

## Scope

Classify the page as browser agents with agent scope. Baselines
perform sequential shopping actions in a simulated website.
Later papers often use different task subsets or interaction setups.
Add those results only after verifying a matching evaluation scope.
