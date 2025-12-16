const express = require("express");
const router = express.Router();
const db = require("../utils/db");

// GET /api/explain/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch deployment info
    const result = await db.query(
      "SELECT selected_resources FROM deployments WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Deployment not found" });
    }

    const resources = result.rows[0].selected_resources;

    // Generate explanation
    let explanation = `Infrastructure Summary for Deployment ${id}:\n\n`;

    if (resources.ec2) {
      explanation += `• EC2 instance of type ${resources.ec2} will be created.\n`;
    }

    if (resources.vpc) {
      explanation += `• A Virtual Private Cloud (VPC) with a /16 CIDR block will be set up.\n`;
    }

    if (resources.s3) {
      explanation += `• An S3 bucket dedicated to this deployment will be provisioned.\n`;
    }

    if (!resources.ec2 && !resources.vpc && !resources.s3) {
      explanation += `• No resources were selected.\n`;
    }

    explanation += `\nThis infrastructure is generated through Terraform and stored in the GitOps repository for automated deployment.`;

    // ✅ IMPORTANT FIX: return resources also
    return res.json({
      deploymentId: id,
      explanation,
      resources
    });

  } catch (error) {
    console.error("Explain API error:", error);
    return res.status(500).json({ error: "Error generating explanation" });
  }
});

module.exports = router;
