##############################################
# ECS Cluster (Fargate)
##############################################
resource "aws_ecs_cluster" "app" {
  name = "${var.project}-${var.environment}-cluster"

  # Container insights give metrics in CloudWatch
  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name        = "${var.project}-${var.environment}-cluster"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
