import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findOne(dto.email);
    if (existing) {
      throw new ConflictException("Email already in use");
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    // Auto-login after registration
    return this.login({ email: dto.email, password: dto.password });
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findOne(dto.email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        photo: user.photo,
        bio: user.bio,
      },
    };
  }
}
