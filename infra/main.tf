resource "aws_s3_bucket" "test_bucket" {
  bucket = "ajay-terraform-demo-bucket-${random_id.suffix.hex}"
}

resource "random_id" "suffix" {
  byte_length = 4
}
