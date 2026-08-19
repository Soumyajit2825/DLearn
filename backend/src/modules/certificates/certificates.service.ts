import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Certificate } from '../../entities/certificate.entity';
import { Enrollment, EnrollmentStatus } from '../../entities/enrollment.entity';
import { IssueCertificateDto } from './dto/issue-certificate.dto';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private certificatesRepository: Repository<Certificate>,
    @InjectRepository(Enrollment)
    private enrollmentsRepository: Repository<Enrollment>,
  ) {}

  async issue(dto: IssueCertificateDto): Promise<Certificate> {
    const existing = await this.certificatesRepository.findOne({
      where: { studentId: dto.studentId, courseId: dto.courseId },
    });
    if (existing) {
      throw new ConflictException('Certificate already issued for this enrollment');
    }

    const enrollment = await this.enrollmentsRepository.findOne({ where: { id: dto.enrollmentId } });
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    const certificateHash = crypto.createHash('sha256').update(`${dto.studentId}-${dto.courseId}-${Date.now()}`).digest('hex');

    const certificate = this.certificatesRepository.create({
      studentId: dto.studentId,
      courseId: dto.courseId,
      enrollmentId: dto.enrollmentId,
      certificateHash,
      issuedAt: new Date(),
      metadata: dto.metadata,
    });

    await this.enrollmentsRepository.update(dto.enrollmentId, {
      certificateId: certificate.id,
      status: EnrollmentStatus.COMPLETED,
      completedAt: new Date(),
    });

    return this.certificatesRepository.save(certificate);
  }

  async getMyCertificates(studentId: string): Promise<Certificate[]> {
    return this.certificatesRepository.find({
      where: { studentId, revoked: false },
      relations: { course: true },
      order: { issuedAt: 'DESC' },
    });
  }

  async verifyByHash(hash: string): Promise<Certificate> {
    const certificate = await this.certificatesRepository.findOne({
      where: { certificateHash: hash },
      relations: { student: true, course: true },
    });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }
    return certificate;
  }

  async findOne(id: string): Promise<Certificate> {
    const certificate = await this.certificatesRepository.findOne({
      where: { id },
      relations: { student: true, course: true },
    });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }
    return certificate;
  }

  async revoke(id: string): Promise<Certificate> {
    const certificate = await this.findOne(id);
    certificate.revoked = true;
    return this.certificatesRepository.save(certificate);
  }
}
