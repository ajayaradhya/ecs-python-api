##############################################
# ECS Task Definition for Python API
##############################################
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project}-${var.environment}-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256 # 0.25 vCPU (free-tier safe)
  memory                   = 512 # 512MB (base requirement for Fargate)
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name      = "${var.project}-container"
      image     = "${aws_ecr_repository.app.repository_url}:latest"
      essential = true

      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
          protocol      = "tcp"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-region        = var.aws_region
          awslogs-group         = "/ecs/${var.project}-${var.environment}"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])

  tags = {
    Name        = "${var.project}-${var.environment}-task"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
