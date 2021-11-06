#include "../include/ImageFile.hpp"

imgedit::PCXImageFile::PCXImageFile(std::string filename) {
    auto ifs = std::ifstream(filename);
    ifs.read((char*)&this->header, this->getHeaderSize());

    if (this->header.bitPerPixel != 8) {
        this->status = false;
        return;
    }

    this->height = this->header.ymax - this->header.ymin + 1;
    this->width  = this->header.xmax - this->header.xmin + 1;

    // decode the entire file
    auto totalBytes = (unsigned long int) this->header.bytesPerLine * this->header.nPlanes * this->height;
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
    this->data = std::vector<std::vector<uint8_t>>(this->header.nPlanes);

    for (int plane = 0; plane < this->data.size(); plane++) {
        for (int line = 0; line < this->height; line++) {

            auto begIter = buffer.begin() +
                           plane * this->header.bytesPerLine +
                           line  * this->header.nPlanes * this->header.bytesPerLine;
            auto endIter = begIter + this->width;

            auto subVec = std::vector<uint8_t>(begIter, endIter);

            this->data[plane].insert(
                this->data[plane].end(),
                subVec.begin(),
                subVec.end()
            );
        }
    }
    if (this->header.nPlanes == 1) {
        ifs.seekg(0, ifs.end);
        auto len = ifs.tellg();
        ifs.seekg(len - std::fpos<__mbstate_t>(769), ifs.beg);

        if (ifs.peek() != 12) {
            this->status = false;
            return;
        }

        ifs.get();

        std::vector<std::vector<uint8_t>> colorPalette(256, std::vector<uint8_t>(3));

        for (int i = 0; i < colorPalette.size(); i++) {
            for (int j = 0; j < colorPalette[0].size(); j++) {
                if(!ifs.get(reinterpret_cast<char&>(colorPalette[i][j]))) {
                    this->status = false;
                    return;
                }
            }
        }

        
        std::vector<std::vector<uint8_t>> colorfulData(3, std::vector<uint8_t>(this->data[0].size()));
        // possible optimization using std::transform
        for (int i = 0; i < this->data[0].size(); i++) {
            for (int j = 0; j < colorfulData.size(); j++)
                colorfulData[j][i] = colorPalette[this->data[0][i]][j];
        }

        this->data = colorfulData;

    } else if (this->header.nPlanes != 3) {
        this->status = false;
        return;
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
