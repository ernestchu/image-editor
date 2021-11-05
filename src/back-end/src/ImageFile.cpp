#include "../include/ImageFile.hpp"

imgedit::PCXImageFile::PCXImageFile(std::string filename) {
    auto ifs = std::ifstream(filename);
    ifs.read((char*)&header, this->getHeaderSize());

    this->height = header.ymax - header.ymin + 1;
    this->width  = header.xmax - header.xmin + 1;

    // decode the entire file
    auto totalBytes = (unsigned long int) header.bytesPerLine * header.nPlanes * this->height;
    auto buffer = std::vector<uint8_t>(totalBytes);
    auto bufferPtr = buffer.data();

    for (unsigned long int bytesCount = 0; bytesCount < totalBytes; ) {
        uint8_t data, count;
        if (!getRun(data, count, ifs))
            break;
        bytesCount += count;
        for ( ; count > 0; count--)
            *bufferPtr++ = data;
    }

    // divide channels
    this->data = std::vector<std::vector<uint8_t>>(header.nPlanes);

    for (int plane = 0; plane < this->data.size(); plane++) {
        for (int line = 0; line < this->height; line++) {

            auto begIter = buffer.begin() +
                           plane * header.bytesPerLine +
                           line  * header.nPlanes * header.bytesPerLine;
            auto endIter = begIter + this->width;

            auto subVec = std::vector<uint8_t>(begIter, endIter);

            this->data[plane].insert(
                this->data[plane].end(),
                subVec.begin(),
                subVec.end()
            );
        }
    }
    
    ifs.close();
}

bool imgedit::PCXImageFile::getRun(uint8_t& data, uint8_t& count, std::ifstream& ifs) {
    count = 1;
    if (ifs.get(reinterpret_cast<char&>(data))) {
        if (0xc0 == (0xc0 & data)) {
            count = 0x3f & data;
            if (!(ifs.get(reinterpret_cast<char&>(data))))
                return false;
        }
        return true;
    }
    return false;
}
