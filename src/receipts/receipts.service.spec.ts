import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptsService } from './receipts.service';
import { ReceiptsRepository } from './receipts.repository';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptStateDto } from './dto/update-receipt-state.dto';

describe('ReceiptsService', () => {
  let service: ReceiptsService;
  let repository: ReceiptsRepository;

  const mockRepository = {
    create: jest.fn(),
    updateState: jest.fn(),
    findAllWithFilters: jest.fn(),
    sumValidatedInMonth: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiptsService,
        {
          provide: ReceiptsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReceiptsService>(ReceiptsService);
    repository = module.get<ReceiptsRepository>(ReceiptsRepository);
    
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a receipt with validated state for RUC starting with 10', async () => {
      const dto: CreateReceiptDto = {
        company_id: '123',
        supplier_ruc: '10123456789',
        invoice_number: 'F001-001',
        amount: 100,
        issue_date: '2024-01-01',
        document_type: 'factura',
      };

      mockRepository.create.mockResolvedValue({
        ...dto,
        igv: 18,
        total: 118,
        state: 'validated',
      });

      const result = await service.register(dto);

      expect(result.state).toBe('validated');
      expect(result.igv).toBe(18);
      expect(result.total).toBe(118);
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should create a receipt with rejected state for RUC starting with 20', async () => {
      const dto: CreateReceiptDto = {
        company_id: '123',
        supplier_ruc: '20123456789',
        invoice_number: 'F001-001',
        amount: 100,
        issue_date: '2024-01-01',
        document_type: 'factura',
      };

      mockRepository.create.mockResolvedValue({
        ...dto,
        igv: 18,
        total: 118,
        state: 'rejected',
      });

      const result = await service.register(dto);

      expect(result.state).toBe('rejected');
      expect(mockRepository.create).toHaveBeenCalled();
    });
  });

  describe('updateState', () => {
    it('should update receipt state', async () => {
      const id = '123';
      const dto: UpdateReceiptStateDto = { state: 'validated' };

      mockRepository.updateState.mockResolvedValue({
        id,
        state: 'validated',
      });

      const result = await service.updateState(id, dto);

      expect(result.state).toBe('validated');
      expect(mockRepository.updateState).toHaveBeenCalledWith(id, 'validated');
    });
  });

  describe('findAll', () => {
    it('should return paginated receipts', async () => {
      const query = { document_type: 'factura' };
      const pagination = { page: 1, limit: 10 };

      const mockResult = {
        items: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };

      mockRepository.findAllWithFilters.mockResolvedValue(mockResult);

      const result = await service.findAll(query, pagination);

      expect(result).toEqual(mockResult);
      expect(mockRepository.findAllWithFilters).toHaveBeenCalledWith(query, pagination);
    });
  });

  describe('queryWithAI', () => {
    it('should return total for validated receipts in May', async () => {
      const question = '¿Cuál fue el total de comprobantes validados en mayo?';
      const mockTotal = 1000;

      mockRepository.sumValidatedInMonth.mockResolvedValue(mockTotal);

      const result = await service.queryWithAI(question);

      expect(result).toBe(`El total de comprobantes validados en mayo es S/. ${mockTotal}`);
      expect(mockRepository.sumValidatedInMonth).toHaveBeenCalledWith(5);
    });

    it('should return default message for unknown question', async () => {
      const question = '¿Cuántos comprobantes hay?';

      const result = await service.queryWithAI(question);

      expect(result).toBe('No se pudo entender la consulta.');
      expect(mockRepository.sumValidatedInMonth).not.toHaveBeenCalled();
    });
  });
}); 