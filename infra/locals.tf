locals {
  private_subnets = [
    aws_subnet.private_a.id,
    aws_subnet.private_b.id
  ]
}
