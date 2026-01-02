
# 🌐 Ping the World — Global Network Latency Dashboard

![Status](https://img.shields.io/badge/status-active-success)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-blue)
![Backend](https://img.shields.io/badge/backend-Python%20API-orange)
![Infra](https://img.shields.io/badge/infrastructure-Terraform-purple)
![AWS](https://img.shields.io/badge/cloud-AWS-yellow)
![License](https://img.shields.io/badge/license-MIT-green)

Ping the World is a **cloud-native network observability platform** that measures and visualizes global latency, jitter, packet loss, and reliability across regions.  
The project includes **frontend, backend, and infrastructure as code (Terraform)** so anyone can deploy and test it end-to-end on AWS.

---

## 📌 What This Repository Contains

- ✅ **Frontend UI** (React + Vite) deployed to Amazon S3
- ✅ **Backend API** (Python) running on AWS ECS (Fargate)
- ✅ **Application Load Balancer (ALB)** exposing the API
- ✅ **Terraform IaC** for full infrastructure provisioning
- ✅ **Auto-refreshing dashboards** (no WebGL / GPU dependency)

---

## 🧱 High-Level Architecture

```
User Browser
    |
    v
Frontend (S3 Static Website)
    |
    v
Application Load Balancer (ALB)
    |
    v
ECS Fargate Service (Python API)
    |
    v
Global Ping Workers / Logic
```

---

## 🧑‍💻 Prerequisites (Required)

### 1️⃣ AWS Account
You must have:
- An active AWS account
- Programmatic access (Access Key + Secret)

### 2️⃣ Install Node.js
Download and install **Node.js 18+**:
https://nodejs.org

Verify:
```bash
node -v
npm -v
```

---

## ☁️ AWS CLI Installation & Setup

### Install AWS CLI

**Windows / macOS / Linux**
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

Verify:
```bash
aws --version
```

### Configure AWS Credentials

```bash
aws configure
```

Enter:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (example: ap-south-2)
- Output format: json

This creates credentials in:
```
~/.aws/credentials
```

---

## 🏗️ Terraform Installation

### Download Terraform
https://developer.hashicorp.com/terraform/downloads

Verify:
```bash
terraform -version
```

---

## 📂 Repository Structure

```
.
├── infra/                  # Terraform IaC
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars
│
├── backend/                # Python API
│   ├── app/
│   ├── Dockerfile
│   └── requirements.txt
│
├── ping-the-world-ui/      # React frontend
│   ├── src/
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## 🚀 Step-by-Step Deployment Guide

### STEP 1: Clone the Repository

```bash
git clone <your-repo-url>
cd <repo-name>
```

---

### STEP 2: Deploy Infrastructure Using Terraform

```bash
cd infra
terraform init
terraform plan
terraform apply
```

Type **yes** when prompted.

Terraform will create:
- VPC
- Subnets
- Security Groups
- ECS Cluster
- ALB
- Target Groups
- IAM Roles
- S3 Bucket

---

### STEP 3: Get ALB DNS Name

After apply completes:

```bash
terraform output
```

You will see:
```
alb_dns_name = "ecs-python-api-dev-alb-xxxx.ap-south-2.elb.amazonaws.com"
```

👉 This is your **Backend API Base URL**.

Example:
```
http://ecs-python-api-dev-alb-xxxx.ap-south-2.elb.amazonaws.com
```

Test it:
```bash
curl http://<alb-dns>/ping-world/aggregate
```

---

### STEP 4: Build & Deploy Backend (ECS)

If using CI/CD, this may already be handled.

Manual (example):
```bash
cd backend
docker build -t ping-world-api .
```

Push image to ECR and redeploy ECS service (instructions depend on your setup).

---

### STEP 5: Configure Frontend to Use ALB

Edit:
```
ping-the-world-ui/src/components/*.tsx
```

Set:
```ts
const BASE_URL = "http://<alb-dns-name>";
```

---

### STEP 6: Build Frontend

```bash
cd ping-the-world-ui
npm install
npm run build
```

---

### STEP 7: Deploy Frontend to S3

```bash
aws s3 sync dist/ s3://<ui-bucket-name> --delete
```

Terraform output will include:
```
ui_bucket_name
```

---

## 🌐 Access the Application

### Backend API
```
http://<alb-dns-name>/ping-world/aggregate
```

### Frontend UI
```
http://<ui-bucket-name>.s3-website.<region>.amazonaws.com
```

Example:
```
http://ping-the-world-ui-dev.s3-website.ap-south-2.amazonaws.com
```

---

## 🧪 Testing & Verification

- UI loads dashboard without errors
- Terminal panel shows region latency
- Sparklines update every 5 seconds
- Radials update values smoothly

---

## 🧹 Cleanup (Destroy Everything)

```bash
cd infra
terraform destroy
```

⚠️ This deletes all AWS resources created by Terraform.

---

## 🔒 Security Notes

- Never commit AWS credentials
- Use IAM least-privilege roles
- ALB exposes only required ports
- Frontend is read-only

---

## 🛣️ Roadmap

- CloudFront + HTTPS
- Authentication
- Alerts & thresholds
- Historical reports
- Multi-environment support

---

## 📄 License

MIT License
