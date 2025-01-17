import Prisma from "../src/db";
import { server } from "../src/server";

beforeAll(async () => {
  await server.ready();
  await Prisma.entry.deleteMany();
});

afterEach(async () => {
  await Prisma.entry.deleteMany();
});

afterAll(async () => {
  await server.close();
  await Prisma.$disconnect();
});

describe("Server API tests", () => {
  describe("GET /get/", () => {
    it("should get no entries", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/get/",
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();
      expect(data).toHaveLength(0);
    });

    it("should get one entry", async () => {
      await Prisma.entry.create({
        data: { title: "Test Entry", description: "This is a test", created_at: new Date() },
      });

      const response = await server.inject({
        method: "GET",
        url: "/get/",
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();
      expect(data).toHaveLength(1);
      expect(data[0].title).toBe("Test Entry");
      expect(data[0].description).toBe("This is a test");
    });

    it("should get multiple entries (10)", async () => {
      for (let i = 0; i < 10; i++) {
        await Prisma.entry.create({
          data: {
            title: `Test Entry #${i}`,
            description: "This is a test",
            created_at: new Date(),
          },
        });
      }

      const response = await server.inject({
        method: "GET",
        url: "/get/",
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();
      expect(data).toHaveLength(10);
      expect(data[0].title).toBe("Test Entry #0");
      expect(data[9].title).toBe("Test Entry #9");
    });
  });

  describe("GET /get/:id", () => {
    it("should get an entry by ID number", async () => {
      const entry = await Prisma.entry.create({
        data: { title: "Single Entry", description: "This one right here", created_at: new Date() },
      });

      const response = await server.inject({
        method: "GET",
        url: `/get/${entry.id}`,
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();
      expect(data.id).toBe(entry.id);
      expect(data.title).toBe("Single Entry");
      expect(data.description).toBe("This one right here");
    });

    it("should return 500 if entry doesnt exist", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/get/non-existent-id",
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ msg: "Error finding entry with id non-existent-id" });
    });
  });

  describe("POST /create/", () => {
    it("should create a new card", async () => {
      const newEntry = {
        title: "New Entry",
        description: "Created via test",
        created_at: new Date(),
      };

      const response = await server.inject({
        method: "POST",
        url: "/create/",
        payload: newEntry,
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();
      expect(data.title).toBe(newEntry.title);
      expect(data.description).toBe(newEntry.description);
      expect(new Date(data.created_at).toISOString()).toBe(newEntry.created_at.toISOString());
    });

    it("should return 500 when creation fails", async () => {
      const badEntry = { title: "Bad Entry" }; // Missing required fields

      const response = await server.inject({
        method: "POST",
        url: "/create/",
        payload: badEntry,
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ msg: "Error creating entry" });
    });
  });

  
  describe("PUT /update/:id", () => {
    it("should update an existing entry with ID", async () => {
      const entry = await Prisma.entry.create({
        data: {
          title: "Initial Title",
          description: "Initial description",
          created_at: new Date(),
        },
      });

      const updatedData = { ...entry, title: "Updated Title", description: "Updated description" };

      const response = await server.inject({
        method: "PUT",
        url: `/update/${entry.id}`,
        payload: updatedData,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ msg: "Updated successfully" });

      const updatedEntry = await Prisma.entry.findUnique({ where: { id: entry.id } });
      expect(updatedEntry?.title).toBe("Updated Title");
      expect(updatedEntry?.description).toBe("Updated description");
    });

    it("should return 500 if update fails", async () => {
      const response = await server.inject({
        method: "PUT",
        url: "/update/non-existent-id",
        payload: { title: "Update Failure Test", description: "This should fail" },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ msg: "Error updating" });
    });
  });

  describe("DELETE /delete/:id", () => {
    it("should delete an entry by ID number", async () => {
      const entry = await Prisma.entry.create({
        data: {
          title: "Entry to Delete",
          description: "This will be deleted",
          created_at: new Date(),
        },
      });

      const response = await server.inject({
        method: "DELETE",
        url: `/delete/${entry.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ msg: "Deleted successfully" });

      const checkEntry = await Prisma.entry.findUnique({ where: { id: entry.id } });
      expect(checkEntry).toBeNull();
    });

    it("should return 500 if deleting card fails", async () => {
      const response = await server.inject({
        method: "DELETE",
        url: "/delete/non-existent-id",
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ msg: "Error deleting entry" });
    });
  });
});
