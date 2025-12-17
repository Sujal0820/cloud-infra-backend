
resource "aws_instance" "example" {
  ami = "ami-0c02fb55956c7d316"
  instance_type = "t2.small"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_s3_bucket" "bucket" {
  bucket = "my-bucket-28"
}
