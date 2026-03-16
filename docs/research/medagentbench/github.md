# MedAgentBench: A Realistic Virtual EHR Environment to Benchmark Medical LLM Agents

<p>
    <a href='https://ai.nejm.org/doi/full/10.1056/AIdbp2500144' target="_blank"><img src='https://img.shields.io/badge/NEJM_AI-Published-AA0000'></a>
</p>

This repository contains implementation of [MedAgentBench](https://ai.nejm.org/doi/full/10.1056/AIdbp2500144), and it is built on top of AgentBench. Please note that this code repo is intended for research purpose, and might not be suitable for large-scale production.


## Dataset Summary



## Quick Start

This section will guide you on how to quickly evaluate gpt-4o-mini as an agent on MedAgentBench.

### Step 1. Prerequisites

Clone this repo and install the dependencies.

```bash
cd MedAgentBench
conda create -n medagentbench python=3.9
conda activate medagentbench
pip install -r requirements.txt
```

Ensure that [Docker](https://www.docker.com/) is properly installed.

```bash
docker ps
```

Download the Docker image and set up the FHIR server

```bash
docker pull jyxsu6/medagentbench:latest
docker tag jyxsu6/medagentbench:latest medagentbench
docker run -p 8080:8080 medagentbench
```

After the console shows something like "Started Application in XXX seconds", you can verify the setup by going to `http://localhost:8080/` and a FHIR server console should be shown.

Download the refsol.py as `src/server/tasks/medagentbench/refsol.py` from [here](https://stanfordmedicine.box.com/s/fizv0unyjgkb1r3a83rfn5p3dc673uho)

### Step 2. Configure the Agent

Fill in your OpenAI API key at the correct location in `configs/agents/openai-chat.yaml`. You can get your OpenAI API key at [OpenAI platform](https://platform.openai.com/).

If you want to use models such as Gemini, Claude on Vertex AI, run `gcloud auth print-access-token` on your terminal to get your access token. 

You can try using `python -m src.client.agent_test` to check if your agent is configured correctly.

By default, `gpt-4o-mini` will be started. You can replace it with other agents by modifying the parameters:

```bash
python -m src.client.agent_test --config configs/agents/api_agents.yaml --agent gpt-4o-mini
```

### Step 3. Start the task server

Starting the task worker involves specific tasks. Manual starting might be cumbersome; hence, we provide an automated
script.

The assumption for this step is that ports from 5000 to 5015 are available. For Mac OS system, you may want to follow [here](https://stackoverflow.com/questions/69955686/why-cant-i-run-the-project-on-port-5000) to free port 5000 to use.

```bash
python -m src.start_task -a
```

This will launch 20 task_workers and automatically connect them
to the controller on port 5000. **After executing this command, please allow approximately 1 minute for the task setup to complete.** If the terminal shows ".... 200 OK", you can open another terminal and follow step 4.

### Step 4. Start the assigner

This step is to actually start the tasks.

If everything is correctly configured so far, you can now initiate the task tests.

```bash
python -m src.assigner
```

### Step 5. Retrieve the results

The results can be found at `outputs/MedAgentBenchv1/gpt-4o-mini/medagentbench-std/overall.json`.

# Citation

If you find our work useful in your research please consider citing:

```
@article{jiang2025medagentbench,
  title={MedAgentBench: A Virtual EHR Environment to Benchmark Medical LLM Agents},
  author={Jiang, Yixing and Black, Kameron C and Geng, Gloria and Park, Danny and Zou, James and Ng, Andrew Y and Chen, Jonathan H},
  journal={NEJM AI},
  pages={AIdbp2500144},
  year={2025},
  publisher={Massachusetts Medical Society}
}
```
