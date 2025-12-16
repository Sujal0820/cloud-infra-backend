const fs = require("fs");
const path = require("path");

function generateTerraformConfig(resources, deploymentId) {
  const folderPath = path.join(__dirname, `../../generated/${deploymentId}`);
  fs.mkdirSync(folderPath, { recursive: true });

  let content = "";

  if (resources.ec2) {
    content += `
resource "aws_instance" "example" {
  ami = "ami-0c02fb55956c7d316"
  instance_type = "${resources.ec2}"
}
`;
  }

  if (resources.vpc) {
    content += `
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}
`;
  }

  if (resources.s3) {
    content += `
resource "aws_s3_bucket" "bucket" {
  bucket = "my-bucket-${deploymentId}"
}
`;
  }

  // Save file
  fs.writeFileSync(path.join(folderPath, "main.tf"), content);

  return { folderPath, terraformConfig: content };
}

module.exports = generateTerraformConfig;
