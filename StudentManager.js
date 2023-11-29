import fs from "fs";

class StudentsManager {
    #filePath;
    #lastId = 0;

    constructor(filePath = "./usuarios.json") {
        this.#filePath = filePath;
        this.#setLastId();
    }

    async addStudent(name, age, courses = []) {
        try {
            if (!name || !age) {
                throw new Error("Missing data.");
            }

            const students = await this.getStudents();

            if (students.find((student) => student.name === name)) {
                throw new Error("Student already exists.");
            }

            const newStudent = {
                name,
                age,
                courses,
                id: ++this.#lastId,
            };

            students.push(newStudent);

            await this.#saveStudents(students);
        } catch (error) {
            console.log(error);
        }
    }

    async getStudents() {
        try {
            if (fs.existsSync(this.#filePath)) {
                const students = JSON.parse(await fs.promises.readFile(this.#filePath, "utf-8"));
                return students;
            }

            return [];
        } catch (error) {
            console.log(error);
        }
    }

    async getStudentById(id) {
        try {
            const students = await this.getStudents();

            const student = students.find((student) => student.id === id);

            return student;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteStudentById(id) {
        try {
            let students = await this.getStudents();

            students = students.filter((student) => student.id !== id);

            this.#saveStudents(students);
        } catch (error) {
            console.log(error);
        }
    }

    async updateStudent(id, fieldToUpdate, newValue) {
        try {
            const students = await this.getStudents();

            const studentIndex = students.findIndex((student) => student.id === id);

            if (studentIndex < 0) {
                throw new Error(`Student with ID ${id} does not exist.`);
            }

            students[studentIndex][fieldToUpdate] = newValue;

            await this.#saveStudents(students);
        } catch (error) {
            console.log(error);
        }
    }

    async addCourseToStudent(id, newCourse) {
        const students = await this.getStudents();
        const studentIndex = students.findIndex((student) => student.id === id);

        if (studentIndex < 0) {
            throw new Error(`Student with ID ${id} does not exist.`);
        }

        if (students[studentIndex].courses.includes(newCourse)) {
            throw new Error(`Student ${students[studentIndex].name} already is in the course ${newCourse}`);
        }

        students[studentIndex].courses.push(newCourse);

        await this.#saveStudents(students);
    }

    async removeCourseFromStudent(id, toRemoveCourse) {
        const students = await this.getStudents();
        const studentIndex = students.findIndex((student) => student.id === id);

        if (studentIndex < 0) {
            throw new Error(`Student with ID ${id} does not exist.`);
        }

        students[studentIndex].courses = students[studentIndex].courses.filter((course) => course !== toRemoveCourse);

        await this.#saveStudents(students);
    }

    async #setLastId() {
        try {
            const students = await this.getStudents();

            if (students.length < 1) {
                this.#lastId = 0;
                return;
            }

            this.#lastId = students[students.length - 1].id;
        } catch (error) {
            console.log(error);
        }
    }

    async #saveStudents(students) {
        try {
            await fs.promises.writeFile(this.#filePath, JSON.stringify(students));
        } catch (error) {
            console.log(error);
        }
    }
}

const studentManager = new StudentsManager("./usuarios.json");

console.log(await studentManager.getStudents());

