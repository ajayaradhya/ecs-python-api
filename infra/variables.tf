variable "project" { default = "ecs-python-api" }
variable "environment" { default = "dev" }
variable "aws_region" { default = "ap-south-2" }
variable "desired_count" {
  description = "Number of ECS tasks to run"
  type        = number
  default     = 1
}
