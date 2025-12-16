const simpleGit = require("simple-git");
const path = require("path");

async function pushToGitOpsRepo(localFolderPath, deploymentId) {
  const gitRepoPath = path.join(__dirname, "../../gitops-repo");
  const git = simpleGit(gitRepoPath);

  try {
    console.log("[gitService] cwd:", gitRepoPath);
    // Ensure we pull latest to avoid conflicts
    await git.fetch();
    await git.add("./*");
    await git.commit(`Deployment ${deploymentId}: Add generated terraform`);
    const pushResult = await git.push("origin", "main");
    console.log("[gitService] push result:", pushResult);
    return true;
  } catch (err) {
    console.error("[gitService] Git push failed:", err.message || err);
    throw err;
  }
}

module.exports = pushToGitOpsRepo;
