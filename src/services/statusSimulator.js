const db = require("../utils/db");

async function updateStatus(deploymentId, newStatus) {
  await db.query(
    "UPDATE deployments SET status = $1 WHERE id = $2",
    [newStatus, deploymentId]
  );
}

function simulateDeploymentStatus(deploymentId) {
  // After 1 sec → generating
  setTimeout(() => {
    updateStatus(deploymentId, "generating");
    console.log(`Deployment ${deploymentId} → generating`);
  }, 1000);

  // After 3 sec → pushed
  setTimeout(() => {
    updateStatus(deploymentId, "pushed");
    console.log(`Deployment ${deploymentId} → pushed`);
  }, 3000);

  // After 5 sec → ready
  setTimeout(() => {
    updateStatus(deploymentId, "ready");
    console.log(`Deployment ${deploymentId} → ready`);
  }, 5000);
}

module.exports = simulateDeploymentStatus;
