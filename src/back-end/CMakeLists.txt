file(GLOB SOURCE_FILES "src/back-end/src/*.cpp" "src/back-end/include/*.hpp")
add_library(${PROJECT_NAME} SHARED main.cpp)
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} Title Image)

add_subdirectory(src)
