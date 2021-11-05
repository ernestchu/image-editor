set(HDIR "${CMAKE_SOURCE_DIR}/src/back-end/include")

add_library(Title SHARED Title.cpp ${HDIR}/Title.hpp)

target_include_directories(Title PUBLIC ${HDIR})
