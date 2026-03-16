<div align="center">
<h1>macOSWorld: A Multilingual Interactive Benchmark for GUI Agents</h1>
</div>

<div align="center">
    <a href="https://scholar.google.com/citations?user=eBvav_0AAAAJ&hl=en">Pei Yang</a><sup>&#42;</sup>&nbsp;, <a href="https://scholar.google.com/citations?user=GMrjppAAAAAJ&hl=en">Hai Ci</a><sup>&#42;</sup>&nbsp;, and <a href="https://sites.google.com/view/showlab">Mike Zheng Shou</a><sup>&#x2709</sup>

</div>

<div align="center">
    <a href='https://sites.google.com/view/showlab/home?authuser=0' target='_blank'>Show Lab</a>, National University of Singapore
    <p>
</div>

<div align="center">
    <a href="https://arxiv.org/abs/2506.04135">
        <img src="https://img.shields.io/badge/arXiv-2506.04135-b31b1b.svg?logo=arXiv" alt="arXiv">
    </a>
    &nbsp;
    <a href="https://macos-world.github.io">
        <img src="https://img.shields.io/badge/Project%20Website-EEEEEE" alt="Project Website">
    </a>
    &nbsp;
    <img src="https://img.shields.io/badge/AWS%20Implementation-F27E3F" />
    <p>
</div>

<img src="assets/readme/teaser.png" width="1024">

<br/>

## 🆕 Updates
 - **[18 Sep 2025]** macOSWorld accepted to NeurIPS 2025
 - **[15 Sep 2025]** Optimised the automated benchmark execution experience; Added a GUI display for real-time benchmark progress and results

<br/>

## ⭐ Features
 - **Interactive macOS environment:** 30 macOS-native apps with their exclusive user interfaces
 - **Multilingual benchmarking:** Tasks and environments available in English, Chinese, Arabic, Japanese and Russian
 - **Safety evaluation:** Dedicated subset for benchmarking agents' resilience under context deception attacks

<br/>

## 🚀 Getting Started

<img src="assets/readme/methodology.png" width="1024">

macOSWorld consists of a local Python testbench script and cloud-hosted AWS macOS instances. The benchmark process involves four main steps:

 - **[Step 1: Local Environment Configuration](#step-1-local-environment-configuration)**
     - [1.1. Base Environment Setup](#11-base-environment-setup)  
     - [1.2. Model-Specific Configurations](#12-model-specific-configurations)  
 - **[Step 2: AWS Environmen Configuration](#step-2-aws-environment-configuration)**
 - **[Step 3: Running the Benchmark](#step-3-running-the-benchmark)**  
     - [3.1. Execute Benchmark](#31-execute-benchmark)  
     - [3.2. Run Testbench Manually](#32-run-testbench-manually)
     - [3.3. Manually Handle Interruptions](#33-manually-handle-interruptions)
     - [3.4. Monitor Progress and Aggregate Results](#34-monitor-progress-and-aggregate-results)
 - **[Step 4: Releasing AWS Resources](#step-4-releasing-aws-resources)**

<br/>

### Step 1: Local Environment Configuration

#### 1.1. Base Environment Setup

```bash
conda create -n macosworld python=3.9.21
conda activate macosworld
pip install vncdotool==1.2.0 boto3==1.36.20 sshtunnel httpx[socks] openai anthropic google-auth google_cloud_aiplatform jupyter
```

#### 1.2. Model-Specific Configurations

**For GPT-4o with SoM Annotations:**

1. Install additional dependencies:
```bash
conda activate macosworld
pip install timm easyocr paddlepaddle paddleocr einops==0.8.0 supervision==0.18.0 ultralytics==8.3.70
```

2. Download model weights:
```bash
mkdir OmniParser
cd OmniParser
git clone https://huggingface.co/microsoft/OmniParser-v2.0
mv OmniParser-v2.0 weights
mv weights/icon_caption weights/icon_caption_florence
```

**For Gemini Models:**

macOSWorld uses the VertexAI API. Follow [this guide](https://www.youtube.com/watch?v=I8W-4oq1onY) to set up credentials and obtain a JSON credential file. Set the environment variable:

```bash
export GOOGLE_APPLICATION_CREDENTIALS='/path/to/gen-lang-client-xxx.json'
```

**For ShowUI:**

```bash
conda activate macosworld
pip install torch==2.6.0 qwen-vl-utils transformers==4.47.0 accelerate==0.26.0
```

**For UI-TARS:**

1. Install dependencies:
```bash
conda create -n uitars python=3.9.21
pip install -U transformers==4.49.0  
pip install vllm==0.6.6 --extra-index-url https://download.pytorch.org/whl/cu124
```

2. Start the vLLM service on the same device running the testbench:
```bash
NCCL_P2P_DISABLE=1 CUDA_VISIBLE_DEVICES=0,1,2,3 vllm serve "bytedance-research/UI-TARS-7B-DPO" --served-model-name UI-TARS-7B-DPO --limit-mm-per-prompt image=3 -tp 4
```

> **Note**: The `tp` parameter specifies the number of GPUs to use and must be a common divisor of 28 and 16.

<br/>

### Step 2: AWS Environment Configuration

macOSWorld requires an AWS-hosted cloud instance. Follow the detailed setup instructions in our [AWS Configuration Guide](./instructions/configure_aws_env.md).

<br/>

### Step 3: Running the Benchmark

#### 3.1. Execute Benchmark

Configure your environment variables and run the testbench. Replace the 🧩 placeholders with your actual values:

```bash
# AWS Configuration
export AWS_ACCESS_KEY_ID=🧩'AKIAIOSFODNN7EXAMPLE'
export AWS_SECRET_ACCESS_KEY=🧩'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
export AWS_DEFAULT_REGION='ap-southeast-1'

# API Keys (configure as needed)
export OPENAI_API_KEY=🧩'sk-proj-...'                    # For OpenAI models
export ANTHROPIC_API_KEY=🧩'sk-ant-...'                  # For Anthropic models
export GOOGLE_APPLICATION_CREDENTIALS=🧩'/path/to/gen-lang-client-xxx.json'  # For Gemini models

# Set credential permission
chmod 400 credential.pem

# Run the benchmark
python run.py \
    --instance_id 🧩i-0d5f51a1d2bc1edb0 \
    --ssh_host 🧩ec2-13-250-104-211.ap-southeast-1.compute.amazonaws.com \
    --ssh_pkey 🧩my_credential.pem \
    --gui_agent_name 🧩gpt-4o-2024-08-06 \
    --paths_to_eval_tasks 🧩./tasks/sys_apps ./tasks/sys_and_interface ./tasks/productivity ./tasks/media ./tasks/file_management ./tasks/advanced ./tasks/multi_apps \
    --languages 🧩task_en_env_en task_zh_env_zh task_ar_env_ar task_ja_env_ja task_ru_env_ru \
    --base_save_dir ./results/gpt_4o \
    --max-steps 15 \
    --snapshot_recovery_timeout_seconds 1200 \
    --task_step_timeout 120
```

| Parameter | Description |
|-----------|-------------|
| `instance_id` | EC2 instance ID |
| `ssh_host` | DNS name or IP address of the EC2 instance |
| `ssh_pkey` | Local file path to your SSH credential `.pem` file |
| `gui_agent_name` | GUI agent identifier (see supported models below) |
| `paths_to_eval_tasks` | Directory paths containing evaluation task JSON files |
| `languages` | Language pairs in format `task_<lang>_env_<lang>` |
| `base_save_dir` | Local directory for storing evaluation results |
| `max_steps` | Maximum dialogue turns per task |
| `snapshot_recovery_timeout_seconds` | Timeout for snapshot recovery (usually doesn't need adjustment) |

**Supported GUI Agents**

1. **OpenAI GPT Series:**
    - `gpt-4o`, `gpt-4o-2024-08-06`
    - With SoM: `gpt-4o/omniparser`, `gpt-4o-2024-08-06/omniparser`
    - Computer Use: `openai/computer-use-preview`

2. **Google Gemini Series:**
    - `gemini-1.5-pro-002`, `gemini-2.5-pro-preview-03-25`

3. **Anthropic Claude:**
    - `claude-3-7-sonnet-20250219/computer-use-2025-01-24`

4. **Open Source Models:**
    - `UI-TARS-7B-DPO`
    - `showlab/ShowUI-2B`

**Supported Language Codes**: English (`en`), Chinese (`zh`), Arabic (`ar`), Japanese (`ja`), Russian (`ru`)

**The Safety Subset:** Run it separately, because the safety subset is only provided in English.

```bash
python run.py \
    --instance_id 🧩i-0d5f51a1d2bc1edb0 \
    --ssh_host 🧩ec2-13-250-104-211.ap-southeast-1.compute.amazonaws.com \
    --ssh_pkey 🧩my_credential.pem \
    --gui_agent_name 🧩gpt-4o-2024-08-06 \
    --paths_to_eval_tasks 🧩./tasks/safety \
    --languages 🧩task_en_env_en \
    --base_save_dir ./results/gpt_4o \
    --max-steps 15 \
    --snapshot_recovery_timeout_seconds 1200 \
    --task_step_timeout 120
```

#### 3.2. Run Testbench Manually

For debugging purposes, you can run only the testbench:

```bash
python testbench.py \
    --instance_id 🧩i-0d5f51a1d2bc1edb0 \
    --ssh_host 🧩ec2-13-250-104-211.ap-southeast-1.compute.amazonaws.com \
    --ssh_pkey 🧩my_credential.pem \
    --gui_agent_name 🧩gpt-4o-2024-08-06 \
    --paths_to_eval_tasks 🧩./tasks/sys_apps ./tasks/sys_and_interface ./tasks/productivity ./tasks/media ./tasks/file_management ./tasks/advanced ./tasks/multi_apps \
    --languages 🧩task_en_env_en task_zh_env_zh task_ar_env_ar task_ja_env_ja task_ru_env_ru \
    --base_save_dir ./results/gpt_4o \
    --max-steps 15 \
    --snapshot_recovery_timeout_seconds 1200 \
    --task_step_timeout 120
```

#### 3.3. Manually Handle Interruptions

When the testbench is interrupted, to continue, the `base_save_dir` needs to be cleaned up first. Although the cleanup functionality is already integrated into `run.py`, you can still perform this cleanup manually. 

```bash
python cleanup.py --base_save_dir /path/to/base_save_dir
```

Clean up the `base_save_dir` before rerunning the testbench. Previously completed tasks will not be deleted or re-executed.

#### 3.4. Monitor Progress and Aggregate Results

Use the provided Jupyter notebook to view benchmark progress and results. This notebook provides a GUI that displays benchmark progress and results through a hierarchical menu.

```
scripts/display_progress.ipynb
```

<br/>

### Step 4: Releasing AWS Resources

After completing the benchmark, follow our [AWS Cleanup Guide](./instructions/release_aws_env.md) to terminate cloud resources and avoid unnecessary charges.

<br/>

# 🤖 Benchmarking Other Agents

To benchmark other agents, follow these two steps:

1. **Create `agent/your_custom_agent.py`** — either modify based on an existing agent or start with `agent/template_for_custom_agent.py`.
2. **Register your agent** in `agent/get_gui_agent.py`.

<br/>

## ⚡ Performance Optimization

Each task evaluation takes approximately 15-20 minutes, with snapshot recovery being the primary bottleneck. Here are two approaches to reduce recovery time:

### Option 1: Manual Environment Recovery

1. **Bypass Snapshot Recovery**: Add `--override_env_reset` parameter to `testbench.py` when evaluating similar tasks
2. **Manual Setup**: [Launch and connect to the environment via VNC](./instructions/configure_aws_env.md) before starting the benchmark
3. **Manual Recovery**: When the testbench displays `(pdb)`, manually restore the environment to its original state, then type `c` to continue

### Option 2: Community Implementations

Consider using community VMware-based implementations for faster and cheaper benchmarking experiences.

<br/>

## 🚧 Other Implementations

 - [yangpei-comp/macosworld_vmware](https://github.com/yangpei-comp/macosworld_vmware): faster and cheaper; local VMware deployment

<br/>

## 🤝 Acknowledgements

The authors thank Kevin Qinghong Lin, Zhiqiang Chen, Noorbakht Khan, Brandon Ng, Mingyu Ouyang, Siyuan Hu, Xiangwu Guo, Henry Hengyuan Zhao, Difei Gao, Christopher Rawles, and Kun Shao for their valuable discussions and feedback.

<br/>

## 📄 Citation

```
@article{macosworld,
    title={macOSWorld: A Multilingual Interactive Benchmark for GUI Agents}, 
    author={Pei Yang and Hai Ci and Mike Zheng Shou},
    year={2025},
    eprint={2506.04135},
    archivePrefix={arXiv},
    primaryClass={cs.AI},
    url={https://arxiv.org/abs/2506.04135}, 
}
```
