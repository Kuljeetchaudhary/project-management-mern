// sending whole object
export const UserRolesEnum = {
    ADMIN: "admin",
    PROJECT_ADMIN: "project_admin",
    MEMBER:"member"
}

//sending  userRolenum as an array  Returns an array of values of the enumerable own properties of an objec
export const AvailableUserRole = Object.values(UserRolesEnum)


export const TaskStatusEnum = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done"
}

export const AvailableTaskStatues =Object.values(TaskStatusEnum)