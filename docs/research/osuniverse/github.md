# OSUniverse

Task-oriented OS-based benchmark for vision-based desktop-oriented GUI-navigation agents.

<p align="center">
  <a href="https://agentsea.github.io/osuniverse/">Website</a> •
  <a href="https://arxiv.org/abs/2505.03570">Paper</a> •
  <a href="https://discord.gg/hhaq7XYPS6">Discord</a>
</p>

<p align="center">
    <a href="https://img.shields.io/badge/PRs-Welcome-red">
        <img src="https://img.shields.io/badge/PRs-Welcome-red">
    </a>
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/License-MIT-blue.svg">
    </a>
</p>

## Updates

* May 6, 2025: Our paper is [published on arXiv](https://arxiv.org/abs/2505.03570).

## Prerequisites

* [Install Docker](https://docs.docker.com/engine/install/) – you need it unless you use your own agent runner (see below).

## Quickstart

Clone the repository:

```bash
git clone https://github.com/agentsea/osuniverse.git
cd osuniverse
```

Export keys:

```bash
export GEMINI_API_KEY=your_api_key      # for the validator
export OPENAI_API_KEY=your_api_key       # for the agent based on GPT-4o
```

Install dependencies:

```bash 
cd agents/react
poetry install
cd ../..
poetry install  # to lock the versions of the dependencies
```

Check the list of tests to run:

```bash
python benchmark.py --agent-yaml agents/react/agent.yaml --agent-model gpt-4o --results results/run-001 --dry-run
```

Specify additional parameters (categories, levels, max steps):

```bash
python benchmark.py --agent-yaml agents/react/agent.yaml --agent-model gpt-4o --results results/run-001 --categories desktop,terminal --levels paper,wood --max-steps 10,30 --dry-run
```

Run the benchmark with the specified parameters with 4 workers:

```bash
python benchmark.py --agent-yaml agents/react/agent.yaml --agent-model gpt-4o --results-dir results/run-001 --categories desktop,terminal --levels paper,wood --max-steps 10,30 --runners 4
```

View the results (you can run this command as soon as the benchmark is started and observe the progress as the tests are being run):

```bash
streamlit run viewer.py -- --dir ./results/run-001
```

* To continue the benchmark from the previous run, run the same command: only tests that were not run before will be run.
* To rerun the failed tests, use `--mode rerun-failed` flag.
* To validate the test cases without running them (given that the test cases were already run), use `--mode validate-only` flag.

Defaults:

- `--agent-yaml` is `agents/react/agent.yaml`
- `--agent-model` is `gpt-4o`
- `--categories` is none (all categories); possible values: `desktop`, `browser`, `gym`, `terminal`, `libreoffice_calc`, `libreoffice_writer`, `multiapp`; should be separated by commas.
- `--levels` is none (all levels); possible values: `paper`, `wood`, `bronze`, `silver`, `gold`; should be separated by commas.
- `--max-steps` is none; default values in config are 5,25,50,100,200; if there are several values separated by commas, the values are applied to levels from paper to gold, with the last value being applied to all remaining levels; for example, `--max-steps 10,20,30` will set 10 steps for paper, 20 steps for wood, 30 steps for bronze, silver, and gold.
- `--testcases-dir` is `testcases`
- `--results-dir` is `results`
- `--runners` is 1
- `--dry-run` is false (use it to see the list of test cases without running them).
- `--mode` is `run-all` (possible values: `run-all`, `rerun-failed`, `validate-only`). `run-all` mode will run all the test cases that have not been run yet. `rerun-failed` mode will rerun the test cases that have been run and failed, and run the test cases that have not been run yet. `validate-only` mode will only validate the test cases that have been run.

## Recommended Models

* `--agent-yaml agents/cua/agent.yaml`:
    * the model is locked to `computer-use-preview-2025-03-11` with `OPENAI_API_KEY`
    * Note: This agent is tailored for the Computer Use Preview model and is not compatible with other models.
* `--agent-yaml agents/claude_computer_use/agent.yaml`:
    * `--agent-model claude-3-5-sonnet-20241022` with `ANTHROPIC_API_KEY`
    * Note: This agent is tailored for the Claude 3.5 Sonnet model and is not compatible with other models.
* `--agent-yaml agents/qwen/agent.yaml`:
    * `--agent-model qwen2.5-vl-72b-instruct` with `DASHSCOPE_API_KEY`
    * `--agent-model qwen2.5-vl-7b-instruct` with `DASHSCOPE_API_KEY`
    * Note: This agent is tailored for the Qwen 2.5 VL models family and is not compatible with other models.
* `--agent-yaml agents/react/agent.yaml`: 
    * `--agent-model gpt-4o-2024-11-20` with `OPENAI_API_KEY`
    * `--agent-model claude-3-5-sonnet-20241022` with `ANTHROPIC_API_KEY`
    * `--agent-model gemini/gemini-1.5-pro-002` with `GEMINI_API_KEY`
    * Note: This agent is tailored for any major VLM through LiteLLM API. Feel free to use it with other models, as long as LiteLLM is compatible with them, and they are capable of generating valid JSONs.

## Results Viewer

Use the Viewer to see the results of the benchmark and to run the human evaluation (optionally).

```bash
streamlit run viewer.py -- --dir ./results/v001
```

## Helper functions

`helper.py` contains a set of helper functions that you can use alongside the benchmark.

* `python helper.py distribution` will show the distribution of the tests across the categories and levels.
* `python helper.py cleanup` will clean up the stuck surfkit devices and trackers (this is useful if you run the benchmark with several runners and some of them get stuck).

## Running the benchmark with external Surfkit-based agents

You can run benchmark on some Surfkit-based agents. See the list of compatible agents below. The agents themselves should be compatible with `surfkit==0.1.396`.

1. Clone the agent's repo alongside the `osuniverse` repo.
2. Run `poetry install` in the agent's directory.
3. Export the API keys the agent needs (e.g. `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, etc).
4. Run `poetry install` in the `osuniverse` directory.
5. Run `export GEMINI_API_KEY=your_api_key` in the `osuniverse` directory.
6. If you want to allow passing a model to your agent, you should read it inside the agent via `os.environ['SURFKIT_AGENT_MODEL']`. It's up to you to define the logic of what to do with this parameter. Also, you may want to pass the `--agent-model-base-url` parameter to the benchmark. Inside the agent, you can read it via `os.environ['SURFKIT_AGENT_MODEL_BASE_URL']`.
7. Run `python benchmark.py --agent-yaml <path_to_agent_yaml> --agent-model <agent_model> --categories desktop --levels paper --results ./results/<your_run_name> --max-steps 10` in the `osuniverse` directory.

## Compatibility

Both Surfkit and Taskara are beng developed rapidly. Because of this, we have to pin the versions of these two core dependencies, the specific docker images we use, and the specific commits or branches of the agents. Therefore:

- Surfkit is pinned to `0.1.396` in the `pyproject.toml` file.
- Taskara is pinned to `0.1.228` in the `pyproject.toml` file.
- AgentDesk is pinned to `0.2.120` in the `pyproject.toml` file.
- The docker image for the Desktop is pinned to `us-docker.pkg.dev/agentsea-dev/agentd/desktop-webtop:8ed7f4e` in each testcase.
- The Taskara docker image is pinned to `us-central1-docker.pkg.dev/agentsea-dev/taskara/api:884e381` in `runners/surfkit_agent_runner.py`.

## Extending the benchmark

You are welcome to extend the benchmark with new test cases. See the `testcases` directory for examples. Also, please refer to our paper for more information about the test cases classification.

You can extend the benchmark by writing your own agents. See the [Writing Custom Surfkit-based Agents](docs/AGENTS.md) guide for more information.

You can also extend the benchmark by writing your own runner. See the [Writing Custom Runners](docs/RUNNERS.md) guide for more information.

## Troubleshooting

Occasionally, agents get stuck. If you run the benchmark with several runners, some of them may get stuck due to limited resources or conflicting ports. Because of this, we recommend stopping the benchmark (`Ctrl+C`) and running it again. If you run the same command again, only the tests that were not run before will be run.

If you use this workaround, please don't forget to clean up the stuck surfkit devices and trackers by running `python helper.py cleanup` or removing them manually in the `Docker Desktop` application.

## Citation

If you use OSUniverse in your research, please cite our paper:

```
@misc{davydova2025osuniversebenchmarkmultimodalguinavigation,
      title={OSUniverse: Benchmark for Multimodal GUI-navigation AI Agents}, 
      author={Mariya Davydova and Daniel Jeffries and Patrick Barker and Arturo Márquez Flores and Sinéad Ryan},
      year={2025},
      eprint={2505.03570},
      archivePrefix={arXiv},
      primaryClass={cs.AI},
      url={https://arxiv.org/abs/2505.03570}, 
}
```
