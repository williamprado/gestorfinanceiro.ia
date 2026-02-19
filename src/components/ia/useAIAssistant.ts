
import { useState, useEffect, useCallback, useRef } from "react";
import { AIAgentConfig, DEFAULT_AI_CONFIG, getAIConfig, saveAIConfig } from "@/lib/aiConfigStorage";

export const useAIAssistant = () => {
    // Estado da Configuração
    const [config, setConfigState] = useState<AIAgentConfig>(getAIConfig());
    const [isOpen, setIsOpen] = useState(false);

    // Estado de Drag
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState<{ x: number; y: number }>(config.position || { x: window.innerWidth - 80, y: window.innerHeight - 80 });
    const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const isDragStart = useRef(false); // Flag para distinguir click de drag

    // Ouvir mudanças na configuração (para atualizar se outra aba mudar ou componente AIConfigPanel salvar)
    useEffect(() => {
        const handleConfigChange = () => {
            const newConfig = getAIConfig();
            setConfigState(newConfig);
            // Atualizar posição apenas se mudou drasticamente ou resetou?
            // Melhor não sobrescrever posição local se estiver arrastando, mas aqui não estamos.
            if (newConfig.position) {
                setPosition(newConfig.position);
            }
        };

        window.addEventListener("ai-config-changed", handleConfigChange);
        // Também carrega ao montar
        handleConfigChange();

        return () => window.removeEventListener("ai-config-changed", handleConfigChange);
    }, []);

    // Handlers de Drag
    const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        // Apenas botão esquerdo ou toque
        if ('button' in e && e.button !== 0) return;

        isDragStart.current = true;
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        dragOffset.current = {
            x: clientX - position.x,
            y: clientY - position.y
        };

        setIsDragging(true);
    }, [position]);

    const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

        // Calcular nova posição
        let newX = clientX - dragOffset.current.x;
        let newY = clientY - dragOffset.current.y;

        // Limites da tela (Viewport)
        const maxX = window.innerWidth - 60; // Largura do botão aprox
        const maxY = window.innerHeight - 60; // Altura do botão aprox

        // Clamp values
        newX = Math.max(10, Math.min(newX, maxX));
        newY = Math.max(10, Math.min(newY, maxY));

        setPosition({ x: newX, y: newY });

        // Se moveu mais que 5 pixels, considera drag real (não click)
        if (Math.abs(clientX - (newX + dragOffset.current.x)) > 5 || Math.abs(clientY - (newY + dragOffset.current.y)) > 5) {
            isDragStart.current = false;
        }
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
            // Salvar nova posição na configuração
            const newConfig = { ...config, position };
            saveAIConfig(newConfig); // Persiste no localStorage
            setConfigState(newConfig); // Atualiza estado local
        }
    }, [isDragging, position, config]);

    // Side Effects para eventos globais de mouse/touch durante drag
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMouseMove);
            window.addEventListener('touchend', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const toggleOpen = () => {
        // Só abre se não estiver arrastando (click puro)
        if (isDragStart.current) {
            setIsOpen(!isOpen);
        }
    };

    return {
        config,
        isOpen,
        setIsOpen,
        position,
        isDragging,
        handlers: {
            onMouseDown: handleMouseDown,
            onTouchStart: handleMouseDown,
            onClick: toggleOpen
        }
    };
};
