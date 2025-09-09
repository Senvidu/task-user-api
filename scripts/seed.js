// scripts/seed.js
import axios from "axios";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080"; // use 3000 for Docker API

const ADMIN = {
  name: "Admin",
  email: "admin@example.com",
  password: "Passw0rd!",
  role: "admin",
};

async function ensureAdminAndLogin() {
  // Try to register (ignore if it already exists)
  try {
    await axios.post(`${BASE_URL}/api/v1/auth/register`, ADMIN);
    console.log("Admin registered.");
  } catch (e) {
    console.log("Admin may already exist. Continuing…");
  }

  // Login to get a token
  const { data } = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
    email: ADMIN.email,
    password: ADMIN.password,
  });
  console.log("Admin logged in.");
  return data.token;
}

async function createUser(token, user) {
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  try {
    const { data } = await axios.post(`${BASE_URL}/api/v1/users`, user, auth);
    console.log(`User created: ${user.email}`);
    return data.id || data._id;
  } catch (e) {
    // If it already exists, try to find it in the first page
    const list = await axios
      .get(`${BASE_URL}/api/v1/users?page=1&limit=50`, auth)
      .then((r) => r.data.items || [])
      .catch(() => []);
    const existing = list.find((u) => u.email === user.email);
    if (existing) {
      console.log(`User already exists: ${user.email}`);
      return existing._id || existing.id;
    }
    throw e;
  }
}

async function createTask(token, task) {
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  try {
    const { data } = await axios.post(`${BASE_URL}/api/v1/tasks`, task, auth);
    console.log(`Task created: ${task.title} (${task.status})`);
    return data._id || data.id;
  } catch (e) {
    console.log(`Task skipped (maybe exists): ${task.title}`);
    return null;
  }
}

async function main() {
  console.log(`Seeding against: ${BASE_URL}`);
  const token = await ensureAdminAndLogin();

  // Create a manager and a normal user
  const managerId = await createUser(token, {
    name: "Manager Mia",
    email: "manager@example.com",
    password: "Secret12",
    role: "manager",
  });

  const userId = await createUser(token, {
    name: "User Uma",
    email: "user@example.com",
    password: "Secret12",
    role: "user",
  });

  // Create a few tasks across different statuses
  await createTask(token, {
    title: "Implement Auth",
    description: "JWT + RBAC",
    deadline: "2030-01-01",
    assignedTo: userId,
    status: "pending",
  });

  await createTask(token, {
    title: "Write README",
    description: "Project docs",
    deadline: "2030-02-01",
    assignedTo: userId,
    status: "in-progress",
  });

  await createTask(token, {
    title: "QA review",
    description: "Verify endpoints & reports",
    deadline: "2030-03-01",
    assignedTo: userId,
    status: "completed",
  });

  console.log("Seed complete ✅");
}

main().catch((e) => {
  console.error("Seed failed:", e?.response?.data || e.message || e);
  process.exit(1);
});
