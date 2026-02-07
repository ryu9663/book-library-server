import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: jest.Mocked<Repository<User>>;
  let existedUsers: User[];
  let newUser: User;
  beforeEach(async () => {
    existedUsers = [
      {
        id: 1,
        name: '짱구',
        email: 'jjangkoo@gmail.com',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];
    newUser = {
      id: 2,
      name: '류준열',
      email: 'ryu9663@naver.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array', async () => {
      mockRepository.find.mockResolvedValue(existedUsers);
      const result = await service.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);

      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single entity', async () => {
      mockRepository.findOne.mockResolvedValue(existedUsers[0]);

      const result = await service.findOne(1);
      expect(result).toEqual(existedUsers[0]);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('회원가입 (user create)', () => {
    it('should create and save entity', async () => {
      const { name, email } = newUser;
      const dto = { name, email };

      mockRepository.findOne.mockResolvedValue(null); // 중복 이메일 없음
      mockRepository.create.mockReturnValue(newUser as any);
      mockRepository.save.mockResolvedValue(newUser as any);

      const result = await service.create(dto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(newUser);
    });

    it('동일한 이메일이 있을때는 유저 생성이 되지 않는다.', async () => {
      const { name, email } = existedUsers[0]; // 이미 존재하는 이메일
      const dto = { name, email };

      mockRepository.findOne.mockResolvedValue(existedUsers[0]);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('유저 정보 업데이트', () => {
    it('빈 객체를 받으면 데이터를 그대로 내려준다', async () => {
      mockRepository.findOne.mockResolvedValue(existedUsers[0]);

      const result = await service.update(1, {});
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(result).toEqual(existedUsers[0]);
    });

    it('should update a user', async () => {
      const dto = {
        name: '수정된 짱구이름',
      };
      const updatedUser = {
        ...existedUsers[0],
        name: '수정된 짱구이름',
      };

      mockRepository.findOne.mockResolvedValue(existedUsers[0]);
      mockRepository.save.mockResolvedValueOnce(updatedUser);

      const result = await service.update(1, dto);

      expect(mockRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(
        service.update(1, { name: '수정된 유저이름' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockRepository.findOne.mockResolvedValue(existedUsers[0]);
      await service.remove(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
