package mg.fizanakara.api.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
@Slf4j
public class JwtUtil {
    @Value("${jwt.secret}")
    private String jwtSecret;


    @Value("${jwt.expiration}")
    private long accessTokenExpirationMs;


    @Value("${jwt.refresh-expiration}")
    private long refreshTokenExpirationMs;


    public String generateAccessToken(String subject) {
        try{
            Date now = new Date();
            Date expiry = new Date(now.getTime() + accessTokenExpirationMs);
            return Jwts.builder()
                    .setSubject(subject)
                    .setIssuedAt(now)
                    .setExpiration(expiry)
                    .signWith(getSigningKey(), Jwts.SIG.HS512)
                    .compact();
        }
        catch (Exception e){
            throw new RuntimeException("Echec lors de la génération de token", e);
        }
    }


    public String generateRefreshToken(String subject) {
        try{
            Date now = new Date();
            Date expiry = new Date(now.getTime() + refreshTokenExpirationMs);
            return Jwts.builder()
                    .setSubject(subject)
                    .setIssuedAt(now)
                    .setExpiration(expiry)
                    .signWith(SignatureAlgorithm.HS512, jwtSecret)
                    .compact();
        }
        catch (Exception e){
            throw new RuntimeException("Echec de la génération refresh token", e);
        }
    }


    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }


    public String getSubject(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.getSubject();
        } catch (JwtException ex){
            return null;
        }
    }
}

