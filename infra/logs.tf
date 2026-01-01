resource "aws_cloudwatch_log_group" "ecs_app" {
  name              = "/ecs/${var.project}-${var.environment}"
  retention_in_days = 7

  tags = {
    ManagedBy = "Terraform"
  }
}
