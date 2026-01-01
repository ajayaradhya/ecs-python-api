##############################################
# Security Groups
##############################################

# ALB Security Group (public entry point)
resource "aws_security_group" "alb_sg" {
  name        = "${var.project}-${var.environment}-alb-sg"
  description = "Allow HTTP traffic from internet to ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Allow HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ECS Task Security Group (private subnet)
resource "aws_security_group" "ecs_sg" {
  name        = "${var.project}-${var.environment}-ecs-sg"
  description = "Allow traffic from ALB to ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow traffic from ALB"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group_rule" "ecs_vpce_https_inbound" {
  type                     = "ingress"
  description              = "Allow ECS tasks to reach VPC endpoints on HTTPS"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  security_group_id        = aws_security_group.ecs_sg.id
  cidr_blocks              = ["10.0.0.0/16"] # your VPC CIDR
}
