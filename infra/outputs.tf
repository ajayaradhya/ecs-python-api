output "vpc_id" {
  value = aws_vpc.main.id
}

# List of public subnets (for ALB)
output "public_subnets" {
  value = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]
}

# List of private subnets (for ECS / Databases)
output "private_subnets" {
  value = [
    aws_subnet.private_a.id,
    aws_subnet.private_b.id
  ]
}

# Convenience single values (optional)
output "public_subnet_a" {
  value = aws_subnet.public_a.id
}

output "public_subnet_b" {
  value = aws_subnet.public_b.id
}

output "private_subnet_a" {
  value = aws_subnet.private_a.id
}

output "private_subnet_b" {
  value = aws_subnet.private_b.id
}

##############################################
# ALB DNS Output
##############################################
output "alb_dns" {
  value       = aws_lb.app.dns_name
  description = "Public endpoint for the ECS Fargate API"
}
