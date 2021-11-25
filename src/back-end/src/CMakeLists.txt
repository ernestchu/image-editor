set(HDIR "${CMAKE_SOURCE_DIR}/src/back-end/include")

add_library(Title SHARED Title.cpp ${HDIR}/Title.hpp)
add_library(Image SHARED Image.cpp ${HDIR}/Image.hpp)
add_library(ImageFile SHARED ImageFile.cpp ${HDIR}/ImageFile.hpp)

target_include_directories(Title PUBLIC ${HDIR} ${NODE_ADDON_API_DIR})
target_include_directories(ImageFile PUBLIC ${HDIR} ${NODE_ADDON_API_DIR})

target_link_libraries(Image PUBLIC ImageFile)
