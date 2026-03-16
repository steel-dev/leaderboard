ABOUTME: 200-word summary of the SimpleQA AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# SimpleQA

SimpleQA is a factuality benchmark for large language models developed by OpenAI, released in October 2024. It measures short-form factual accuracy by presenting straightforward questions that have single, unambiguous correct answers. The benchmark is part of OpenAI's simple-evals evaluation suite and is designed to test whether models can provide accurate factual responses rather than hallucinate plausible-sounding but incorrect information.

Evaluation classifies each response as correct, incorrect, or not attempted, enabling measurement of both accuracy and calibration (whether models appropriately abstain when uncertain). Results from OpenAI's simple-evals show significant variation across models: GPT-4.5-preview leads at 62.5%, o3 scores 49.4%, and GPT-4o variants range from 38.8% to 40.1%. Reasoning-focused models like o3-mini score notably lower at 13.4%, and o4-mini at 20.2%, suggesting that chain-of-thought reasoning does not reliably improve factual recall. Smaller models like GPT-4o-mini score 9.5%.

SimpleQA is significant because it isolates factual accuracy from other capabilities like reasoning or instruction following. The wide spread of scores across model families reveals that factuality remains a distinct and unsolved challenge. Its inclusion in OpenAI's standard evaluation suite ensures broad adoption as a reporting metric for new model releases. The benchmark is available under an MIT license.
