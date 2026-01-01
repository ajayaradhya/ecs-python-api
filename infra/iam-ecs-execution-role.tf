##############################################
# IAM Role for ECS Task Execution
# Allows ECS tasks to:
# - Pull images from ECR
# - Write logs to CloudWatch
##############################################

resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.project}-${var.environment}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name        = "${var.project}-${var.environment}-ecs-execution-role"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

##############################################
# Policy attachment for ECR + CloudWatch Logs
##############################################

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
