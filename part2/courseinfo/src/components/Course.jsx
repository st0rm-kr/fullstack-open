const Course = ({ course }) => {
    return (
        <div>
            <Header course={course} />
            {course.parts.map((part) => (
                <Part key={part.id} part={part} />
            ))}
            <Total course={course} />
        </div>
    )
}

const Part = ({ part }) => {
    return <p>{part.name} {part.exercises}</p>
}

const Total = ({ course }) => {
    return <p>Total of {course.parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</p>
}
const Header = ({ course }) => {
    return <h1>{course.name}</h1>
}

export default Course