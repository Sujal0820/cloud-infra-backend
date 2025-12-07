# cloud-infra-backend
Node.js backend for generating Terraform, managing workflows, and connecting to GitOps.

# Cloud Infrastructure Platform - Backend

Node.js backend for generating Terraform templates, managing workflows, 
and triggering GitOps deployments.

## Features
- Receive resource selections from frontend
- Generate Terraform files dynamically
- Push files to GitOps repo
- Provide deployment status to frontend

## Tech Stack
- Node.js (Express)
- PostgreSQL (Prisma or Sequelize)
- Terraform CLI (invoked via child process)
- Git integration

## Project Status
Created on Day 1 — APIs start in Week 1.

