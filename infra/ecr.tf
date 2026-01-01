##############################################
# ECR Repository for our Python App
##############################################
resource "aws_ecr_repository" "app" {
  name                 = "${var.project}-${var.environment}"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name        = "${var.project}-${var.environment}-ecr"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

##############################################
# Output to use in CI/CD and ECS later
##############################################
output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}
